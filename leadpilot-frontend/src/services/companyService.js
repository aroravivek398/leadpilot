import { apiRequest } from './api'

export async function getCompanies() {
  const token = localStorage.getItem('token')

  return apiRequest('/api/companies', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function createCompany(companyData) {
  const token = localStorage.getItem('token')

  return apiRequest('/api/companies', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(companyData),
  })
}


export async function updateCompany(id, companyData) {
  const token = localStorage.getItem('token')

  return apiRequest(`/api/companies/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(companyData),
  })
}

export async function deleteCompany(id) {
  const token = localStorage.getItem('token')

  return apiRequest(`/api/companies/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}