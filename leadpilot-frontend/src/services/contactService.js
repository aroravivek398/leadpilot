import { apiRequest } from './api'

export async function getContactsByCompany(companyId) {
  const token = localStorage.getItem('token')

  return apiRequest(`/api/contacts/company/${companyId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function createContact(contactData) {
  const token = localStorage.getItem('token')

  return apiRequest('/api/contacts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(contactData),
  })
}