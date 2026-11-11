import { getDefaultShopPageContent } from './shopData'
import { adminApiFetch } from './adminAuthApi'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const SHOP_CONTENT_EVENT = 'gfc-shop-content-updated'
const shopPageChannel = typeof BroadcastChannel === 'undefined'
  ? null
  : new BroadcastChannel('gfc-shop-content')

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

function isValidContent(result) {
  return result?.manager && Array.isArray(result.categories) && Array.isArray(result.products)
}

export async function fetchShopPageContent() {
  const response = await fetch(`${API_BASE_URL}/api/shop`)
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Le serveur a répondu ${response.status} en lisant la boutique.`))
  }
  const result = await response.json()
  if (!isValidContent(result)) {
    throw new Error('La réponse du serveur ne contient pas les informations de la boutique.')
  }
  return result
}

export async function saveShopPageContent(content) {
  const response = await adminApiFetch(`${API_BASE_URL}/api/shop`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  })
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Le serveur a répondu ${response.status} lors de l’enregistrement de la boutique.`))
  }
  const result = await response.json()
  if (!isValidContent(result)) {
    throw new Error('La réponse du serveur ne contient pas les informations de boutique enregistrées.')
  }
  return result
}

export function publishShopPageContent(content) {
  window.dispatchEvent(new CustomEvent(SHOP_CONTENT_EVENT, { detail: content }))
  shopPageChannel?.postMessage(content)
}

export function subscribeToShopPageContent(onUpdate) {
  const handleWindowUpdate = (event) => onUpdate(event.detail)
  const handleChannelUpdate = (event) => onUpdate(event.data)
  window.addEventListener(SHOP_CONTENT_EVENT, handleWindowUpdate)
  shopPageChannel?.addEventListener('message', handleChannelUpdate)
  return () => {
    window.removeEventListener(SHOP_CONTENT_EVENT, handleWindowUpdate)
    shopPageChannel?.removeEventListener('message', handleChannelUpdate)
  }
}

export function getShopContentForAdmin(content) {
  return [
    { ...content.manager, group: 'manager' },
    ...content.categories.map((category) => ({ ...category, group: 'categories' })),
    ...content.products.map((product) => ({ ...product, group: 'products' })),
  ]
}

export function getDefaultShopContentForAdmin() {
  return getShopContentForAdmin(getDefaultShopPageContent())
}
