import { apiRequest } from './api'

export async function getUsers() {
  const token = localStorage.getItem('token')

  return apiRequest('/api/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}