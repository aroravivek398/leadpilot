import { apiRequest } from './api'

export async function getLeads() {
  const token = localStorage.getItem('token')

  return apiRequest('/api/leads', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getLeadById(id) {
  const token = localStorage.getItem('token')

  return apiRequest(`/api/leads/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function createLead(leadData) {
  const token = localStorage.getItem('token')

  return apiRequest('/api/leads', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(leadData),
  })
}
export async function updateLead(id, leadData) {
  const token = localStorage.getItem('token')

  return apiRequest(`/api/leads/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(leadData),
  })
}

export async function deleteLead(id) {
  const token = localStorage.getItem('token')

  return apiRequest(`/api/leads/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}