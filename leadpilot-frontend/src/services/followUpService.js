import { apiRequest } from './api'

export async function getFollowUpsByLead(leadId) {
  const token = localStorage.getItem('token')

  return apiRequest(`/api/follow-ups/lead/${leadId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function createFollowUp(followUpData) {
  const token = localStorage.getItem('token')


  return apiRequest('/api/follow-ups', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    
    },
    body: JSON.stringify(followUpData),
  })
}

export async function updateFollowUp(followUpId, followUpData) {
  const token = localStorage.getItem('token')

  return apiRequest(`/api/follow-ups/${followUpId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(followUpData),
  })
}