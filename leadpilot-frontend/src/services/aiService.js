import { apiRequest } from './api'

export async function analyzeLead(leadId) {
  const token = localStorage.getItem('token')

  return apiRequest(`/api/ai/leads/${leadId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
