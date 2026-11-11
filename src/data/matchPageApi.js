import { defaultMatches, defaultOpponentTeams } from './matchData'
import { adminApiFetch } from './adminAuthApi'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const MATCH_CONTENT_EVENT = 'gfc-match-content-updated'
const matchPageChannel = typeof BroadcastChannel === 'undefined'
  ? null
  : new BroadcastChannel('gfc-match-content')

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

export async function fetchMatchPageContent() {
  const response = await fetch(`${API_BASE_URL}/api/matches`)
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Le serveur a répondu ${response.status} en lisant le calendrier.`))
  }
  const result = await response.json()
  if (!Array.isArray(result.opponents) || !Array.isArray(result.matches)) {
    throw new Error('La réponse du serveur ne contient pas les équipes et les matchs.')
  }
  return result
}

export async function saveMatchPageContent(content) {
  const response = await adminApiFetch(`${API_BASE_URL}/api/matches`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  })
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Le serveur a répondu ${response.status} lors de l’enregistrement du calendrier.`))
  }
  const result = await response.json()
  if (!Array.isArray(result.opponents) || !Array.isArray(result.matches)) {
    throw new Error('La réponse du serveur ne contient pas les équipes et les matchs enregistrés.')
  }
  return result
}

export function publishMatchPageContent(content) {
  window.dispatchEvent(new CustomEvent(MATCH_CONTENT_EVENT, { detail: content }))
  matchPageChannel?.postMessage(content)
}

export function subscribeToMatchPageContent(onUpdate) {
  const handleWindowUpdate = (event) => onUpdate(event.detail)
  const handleChannelUpdate = (event) => onUpdate(event.data)
  window.addEventListener(MATCH_CONTENT_EVENT, handleWindowUpdate)
  matchPageChannel?.addEventListener('message', handleChannelUpdate)
  return () => {
    window.removeEventListener(MATCH_CONTENT_EVENT, handleWindowUpdate)
    matchPageChannel?.removeEventListener('message', handleChannelUpdate)
  }
}

export function getDefaultMatchPageContent() {
  return {
    opponents: defaultOpponentTeams.map((team) => ({ ...team, group: 'opponents' })),
    matches: defaultMatches.map((match) => ({ ...match })),
  }
}
