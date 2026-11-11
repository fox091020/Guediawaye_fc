import { createNewsSlug, defaultNewsArticles } from './newsData'
import { adminApiFetch } from './adminAuthApi'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const NEWS_CONTENT_EVENT = 'gfc-news-content-updated'
const newsChannel = typeof BroadcastChannel === 'undefined'
  ? null
  : new BroadcastChannel('gfc-news-content')

async function getErrorMessage(response, fallback) {
  const detail = await response.text()
  if (!detail) return fallback
  try {
    const body = JSON.parse(detail)
    return body.detail || body.message || detail
  } catch {
    return detail
  }
}

function fromApi(article) {
  const image = article.imageUrl || article.image || ''
  return {
    id: article.id,
    slug: article.slug || createNewsSlug(article.title),
    category: article.category,
    date: article.publishedAt?.slice(0, 10) || article.date || '',
    title: article.title,
    summary: article.summary || article.intro || '',
    content: article.content || article.paragraphs?.join('\n\n') || '',
    image,
    images: article.imageUrls?.length ? article.imageUrls : image ? [image] : [],
    externalUrl: article.externalUrl || '',
    featured: Boolean(article.featured),
    published: article.published !== false,
  }
}

function toApi(article) {
  const image = article.image || article.images?.[0] || ''
  const date = article.date || new Date().toISOString().slice(0, 10)
  return {
    slug: article.slug || createNewsSlug(article.title),
    category: article.category,
    title: article.title,
    summary: article.summary,
    content: article.content,
    imageUrl: image,
    imageUrls: article.images?.length ? article.images : image ? [image] : [],
    externalUrl: article.externalUrl || null,
    featured: Boolean(article.featured),
    published: article.published !== false,
    publishedAt: `${date}T12:00:00Z`,
  }
}

export async function fetchNewsArticles() {
  const response = await fetch(`${API_BASE_URL}/api/news`)
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Le serveur a répondu ${response.status} en lisant les actualités.`))
  }
  const result = await response.json()
  if (!Array.isArray(result)) {
    throw new Error('La réponse du serveur ne contient pas une liste d’actualités.')
  }
  return result.map(fromApi)
}

export async function saveNewsArticle(article) {
  const isPersisted = Number.isInteger(Number(article.id)) && Number(article.id) > 0
  const url = isPersisted
    ? `${API_BASE_URL}/api/news/${article.id}`
    : `${API_BASE_URL}/api/news`
  const response = await adminApiFetch(url, {
    method: isPersisted ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toApi(article)),
  })
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Le serveur a répondu ${response.status} lors de l’enregistrement de l’actualité.`))
  }
  return fromApi(await response.json())
}

export async function deleteNewsArticle(id) {
  const response = await adminApiFetch(`${API_BASE_URL}/api/news/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Le serveur a répondu ${response.status} lors de la suppression de l’actualité.`))
  }
}

export function publishNewsArticles(articles) {
  window.dispatchEvent(new CustomEvent(NEWS_CONTENT_EVENT, { detail: articles }))
  newsChannel?.postMessage(articles)
}

export function subscribeToNewsArticles(onUpdate) {
  const handleWindowUpdate = (event) => onUpdate(event.detail)
  const handleChannelUpdate = (event) => onUpdate(event.data)
  window.addEventListener(NEWS_CONTENT_EVENT, handleWindowUpdate)
  newsChannel?.addEventListener('message', handleChannelUpdate)
  return () => {
    window.removeEventListener(NEWS_CONTENT_EVENT, handleWindowUpdate)
    newsChannel?.removeEventListener('message', handleChannelUpdate)
  }
}

export function getDefaultNewsArticles() {
  return defaultNewsArticles.map((article) => ({ ...article, images: [...article.images] }))
}
