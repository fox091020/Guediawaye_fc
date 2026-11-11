import { createInitialAdminData } from './adminData'
import { adminApiFetch } from './adminAuthApi'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const MEDIA_API_URL = API_BASE_URL.replace(/\/+$/, '')
const HOME_CONTENT_EVENT = 'gfc-homepage-content-updated'
const homePageChannel = typeof BroadcastChannel === 'undefined'
  ? null
  : new BroadcastChannel('gfc-homepage-content')
let pendingHomePageRequest

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

async function requestHomePageContent() {
  const response = await fetch(`${API_BASE_URL}/api/homepage`)
  if (!response.ok) {
    throw new Error(`Le serveur a répondu ${response.status} en lisant la page d’accueil.`)
  }

  const result = await response.json()
  if (!Array.isArray(result.items)) {
    throw new Error('La réponse du serveur ne contient pas les sections de la page d’accueil.')
  }
  return ensureEventsImage(result.items)
}

function ensureEventsImage(items) {
  if (items.some((item) => item.group === 'events')) return items
  const defaultItem = createInitialAdminData().home.find((item) => item.group === 'events')
  return defaultItem ? [...items, defaultItem] : items
}

export async function fetchHomePageContent() {
  if (!pendingHomePageRequest) {
    pendingHomePageRequest = requestHomePageContent().finally(() => {
      pendingHomePageRequest = undefined
    })
  }
  return pendingHomePageRequest
}

export async function saveHomePageContent(items) {
  const response = await adminApiFetch(`${API_BASE_URL}/api/homepage`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Le serveur a répondu ${response.status} lors de l’enregistrement.`))
  }

  const result = await response.json()
  if (!Array.isArray(result.items)) {
    throw new Error('La réponse du serveur ne contient pas les sections enregistrées.')
  }
  return ensureEventsImage(result.items)
}

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await adminApiFetch(`${MEDIA_API_URL}/api/media`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Le serveur a répondu ${response.status} lors du téléversement.`))
  }

  const result = await response.json()
  if (typeof result.url !== 'string' || !result.url) {
    throw new Error('La réponse du serveur ne contient pas l’adresse de l’image.')
  }
  return result.url
}

export function publishHomePageContent(items) {
  window.dispatchEvent(new CustomEvent(HOME_CONTENT_EVENT, { detail: items }))
  homePageChannel?.postMessage(items)
}

export function subscribeToHomePageContent(onUpdate) {
  const handleWindowUpdate = (event) => onUpdate(event.detail)
  const handleChannelUpdate = (event) => onUpdate(event.data)
  window.addEventListener(HOME_CONTENT_EVENT, handleWindowUpdate)
  homePageChannel?.addEventListener('message', handleChannelUpdate)
  return () => {
    window.removeEventListener(HOME_CONTENT_EVENT, handleWindowUpdate)
    homePageChannel?.removeEventListener('message', handleChannelUpdate)
  }
}

export function getDefaultHomePageContent() {
  return createInitialAdminData().home
}
