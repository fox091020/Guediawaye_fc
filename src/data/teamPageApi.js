import { createInitialAdminData } from './adminData'
import { adminApiFetch } from './adminAuthApi'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const TEAM_CONTENT_EVENT = 'gfc-team-content-updated'
const teamPageChannel = typeof BroadcastChannel === 'undefined'
  ? null
  : new BroadcastChannel('gfc-team-content')

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

export async function fetchTeamPageContent() {
  const response = await fetch(`${API_BASE_URL}/api/team`)
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Le serveur a répondu ${response.status} en lisant la page équipe.`))
  }
  const result = await response.json()
  if (!Array.isArray(result.items)) {
    throw new Error('La réponse du serveur ne contient pas les sections équipe.')
  }
  return result.items
}

export async function saveTeamPageContent(items) {
  const response = await adminApiFetch(`${API_BASE_URL}/api/team`, {
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

export function publishTeamPageContent(items) {
  window.dispatchEvent(new CustomEvent(TEAM_CONTENT_EVENT, { detail: items }))
  teamPageChannel?.postMessage(items)
}

export function subscribeToTeamPageContent(onUpdate) {
  const handleWindowUpdate = (event) => onUpdate(event.detail)
  const handleChannelUpdate = (event) => onUpdate(event.data)
  window.addEventListener(TEAM_CONTENT_EVENT, handleWindowUpdate)
  teamPageChannel?.addEventListener('message', handleChannelUpdate)
  return () => {
    window.removeEventListener(TEAM_CONTENT_EVENT, handleWindowUpdate)
    teamPageChannel?.removeEventListener('message', handleChannelUpdate)
  }
}

export function getDefaultTeamPageContent() {
  return createInitialAdminData().team
}
