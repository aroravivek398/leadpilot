import { apiRequest } from './api'

export async function getActivitiesByLead(leadId) {
  const token = localStorage.getItem('token')

  return apiRequest(`/api/activities/lead/${leadId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function createActivity(activityData) {
  const token = localStorage.getItem('token')

  return apiRequest('/api/activities', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(activityData),
  })
}