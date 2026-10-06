const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const isLogin = endpoint === '/api/auth/login'

    // Login galat ho to sirf message dikhao
    if (response.status === 401 && isLogin) {
      throw new Error('Invalid email or password')
    }

    // Token expire ya invalid ho gaya: session saaf karke login par bhejo
    if (response.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    throw new Error(data?.error || data?.message || 'Something went wrong')
  }

  return data
}

export { apiRequest }