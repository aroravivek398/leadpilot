import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { registerUser } from '../services/authservice'
import AuthArt, { Eye } from '../components/auth/AuthArt'

import './Login.css'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await registerUser(name, email, password)

      navigate('/login')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-shell">
        <AuthArt />

        <main className="login-card">
          <form onSubmit={handleSubmit}>
            <h1>Create your account</h1>

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
                <button type="button" className="eye" onClick={() => setShowPassword((p) => !p)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  <Eye off={showPassword} />
                </button>
              </div>
            </div>

            {error && <p className="login-error" role="alert">{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="signup">
              Already have an account? <Link to="/login" className="link">Sign in</Link>
            </p>
          </form>
        </main>
      </div>
    </div>
  )
}

export default Register
