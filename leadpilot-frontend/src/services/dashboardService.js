import { apiRequest } from './api'

export async function getDashboard() {
  const token = localStorage.getItem('token')

  return apiRequest('/api/dashboard', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}