import { defaultContactPageContent } from './contactData'
import { adminApiFetch } from './adminAuthApi'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const CONTACT_CONTENT_EVENT = 'gfc-contact-content-updated'
const contactPageChannel = typeof BroadcastChannel === 'undefined'
  ? null
  : new BroadcastChannel('gfc-contact-content')

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

export async function fetchContactPageContent() {
  const response = await fetch(`${API_BASE_URL}/api/contact`)
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Le serveur a répondu ${response.status} en lisant la page contact.`))
  }
  const result = await response.json()
  if (!Array.isArray(result.items)) {
    throw new Error('La réponse du serveur ne contient pas les informations de contact.')
  }
  return result.items
}

export async function saveContactPageContent(items) {
  const response = await adminApiFetch(`${API_BASE_URL}/api/contact`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Le serveur a répondu ${response.status} lors de l’enregistrement.`))
  }
  const result = await response.json()
  if (!Array.isArray(result.items)) {
    throw new Error('La réponse du serveur ne contient pas les informations enregistrées.')
  }
  return result.items
}

export function publishContactPageContent(items) {
  window.dispatchEvent(new CustomEvent(CONTACT_CONTENT_EVENT, { detail: items }))
  contactPageChannel?.postMessage(items)
}

export function subscribeToContactPageContent(onUpdate) {
  const handleWindowUpdate = (event) => onUpdate(event.detail)
  const handleChannelUpdate = (event) => onUpdate(event.data)
  window.addEventListener(CONTACT_CONTENT_EVENT, handleWindowUpdate)
  contactPageChannel?.addEventListener('message', handleChannelUpdate)
  return () => {
    window.removeEventListener(CONTACT_CONTENT_EVENT, handleWindowUpdate)
    contactPageChannel?.removeEventListener('message', handleChannelUpdate)
  }
}

export function getDefaultContactPageContent() {
  return defaultContactPageContent.map((item) => ({ ...item }))
}
