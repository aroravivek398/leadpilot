import { apiRequest } from './api'

function authHeaders() {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

export function askCrm(question) {
  return apiRequest('/api/ai/ask', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ question }),
  })
}

export function syncCrmIndex() {
  return apiRequest('/api/ai/index', {
    method: 'POST',
    headers: authHeaders(),
  })
}