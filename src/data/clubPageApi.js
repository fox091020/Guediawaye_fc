import { createInitialAdminData } from './adminData'
import { adminApiFetch } from './adminAuthApi'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const CLUB_CONTENT_EVENT = 'gfc-club-content-updated'
const clubPageChannel = typeof BroadcastChannel === 'undefined'
  ? null
  : new BroadcastChannel('gfc-club-content')

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

export async function fetchClubPageContent() {
  const response = await fetch(`${API_BASE_URL}/api/club`)
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Le serveur a répondu ${response.status} en lisant la page du club.`))
  }
  const result = await response.json()
  if (!Array.isArray(result.items)) {
    throw new Error('La réponse du serveur ne contient pas les sections de la page du club.')
  }
  return result.items
}

export async function saveClubPageContent(items) {
  if (items.filter((item) => item.group === 'figures').length > 9) {
    throw new Error('La page du club ne peut pas contenir plus de 9 figures.')
  }

  const response = await adminApiFetch(`${API_BASE_URL}/api/club`, {
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
  return result.items
}

export function publishClubPageContent(items) {
  window.dispatchEvent(new CustomEvent(CLUB_CONTENT_EVENT, { detail: items }))
  clubPageChannel?.postMessage(items)
}

export function subscribeToClubPageContent(onUpdate) {
  const handleWindowUpdate = (event) => onUpdate(event.detail)
  const handleChannelUpdate = (event) => onUpdate(event.data)
  window.addEventListener(CLUB_CONTENT_EVENT, handleWindowUpdate)
  clubPageChannel?.addEventListener('message', handleChannelUpdate)
  return () => {
    window.removeEventListener(CLUB_CONTENT_EVENT, handleWindowUpdate)
    clubPageChannel?.removeEventListener('message', handleChannelUpdate)
  }
}

export function getDefaultClubPageContent() {
  return createInitialAdminData().club
}
