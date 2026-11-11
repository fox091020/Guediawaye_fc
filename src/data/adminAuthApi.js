const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
let csrfToken
let csrfTokenRequest

async function getCsrfToken() {
  if (csrfToken) return csrfToken
  if (!csrfTokenRequest) {
    csrfTokenRequest = fetch(`${API_BASE_URL}/api/auth/csrf`, { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Impossible d’obtenir le jeton de sécurité (${response.status}).`)
        const result = await response.json()
        if (typeof result.token !== 'string' || !result.token) {
          throw new Error('Le serveur n’a pas fourni de jeton de sécurité.')
        }
        csrfToken = result.token
        return csrfToken
      })
      .finally(() => {
        csrfTokenRequest = undefined
      })
  }
  return csrfTokenRequest
}

export async function adminApiFetch(url, options = {}) {
  const method = (options.method ?? 'GET').toUpperCase()
  const headers = new Headers(options.headers)
  if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
    headers.set('X-CSRF-TOKEN', await getCsrfToken())
  }
  const response = await fetch(url, {
    ...options,
    method,
    headers,
    credentials: 'include',
  })
  const authRoute = /\/api\/auth\/(me|login)$/.test(url)
  if (response.status === 401 && !authRoute) {
    csrfToken = undefined
    window.dispatchEvent(new CustomEvent('gfc-admin-session-expired'))
  } else if (response.status === 403 && !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
    csrfToken = undefined
    const sessionResponse = await fetch(`${API_BASE_URL}/api/auth/me`, { credentials: 'include' })
    if (sessionResponse.status === 401) {
      window.dispatchEvent(new CustomEvent('gfc-admin-session-expired'))
    }
  }
  return response
}

export async function fetchCurrentAdmin() {
  const response = await adminApiFetch(`${API_BASE_URL}/api/auth/me`)
  if (response.status === 401) return null
  if (!response.ok) throw new Error(`Impossible de vérifier la session (${response.status}).`)
  return response.json()
}

export async function loginAdmin(username, password) {
  const response = await adminApiFetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) throw new Error(await readError(response, 'Connexion refusée.'))
  return response.json()
}

export async function logoutAdmin() {
  const response = await adminApiFetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST' })
  if (!response.ok && response.status !== 401) {
    throw new Error(await readError(response, 'Impossible de fermer la session.'))
  }
  csrfToken = undefined
}

export async function changeAdminPassword(currentPassword, newPassword) {
  const response = await adminApiFetch(`${API_BASE_URL}/api/auth/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  if (!response.ok) throw new Error(await readError(response, 'Impossible de modifier le mot de passe.'))
  return response.json()
}

export async function fetchAdminAccounts() {
  const response = await adminApiFetch(`${API_BASE_URL}/api/auth/admins`)
  if (!response.ok) throw new Error(await readError(response, 'Impossible de charger les profils administrateur.'))
  return response.json()
}

export async function createAdminAccount(account) {
  const response = await adminApiFetch(`${API_BASE_URL}/api/auth/admins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  })
  if (!response.ok) throw new Error(await readError(response, 'Impossible de créer le profil administrateur.'))
  return response.json()
}

export async function updateAdminAccount(id, account) {
  const response = await adminApiFetch(`${API_BASE_URL}/api/auth/admins/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  })
  if (!response.ok) throw new Error(await readError(response, 'Impossible de modifier le profil administrateur.'))
  return response.json()
}

export async function deleteAdminAccount(id) {
  const response = await adminApiFetch(`${API_BASE_URL}/api/auth/admins/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error(await readError(response, 'Impossible de supprimer le profil administrateur.'))
}

export async function setAdminAccountEnabled(id, enabled) {
  const response = await adminApiFetch(`${API_BASE_URL}/api/auth/admins/${id}/enabled`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  })
  if (!response.ok) throw new Error(await readError(response, 'Impossible de modifier le statut du profil.'))
  return response.json()
}

async function readError(response, fallback) {
  const text = await response.text()
  if (!text) return fallback
  try {
    const body = JSON.parse(text)
    return body.message || body.detail || fallback
  } catch {
    return text
  }
}
