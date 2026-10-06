import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { loginUser } from '../services/authservice'
import { useAuth } from '../context/AuthContext'

import AuthArt, { Eye } from '../components/auth/AuthArt'

import './Login.css'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await loginUser(email, password)

      await login(response.token)

      navigate('/')
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
            <h1>Sign in to LeadPilot</h1>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="link">Forgot password?</Link>
              </div>
              <div className="input-wrap">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Eye off={showPassword} />
                </button>
              </div>
            </div>

            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Remember me
            </label>

            {error && <p className="login-error" role="alert">{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="signup">
              Not registered yet? <Link to="/register" className="link">Create an account</Link>
            </p>
          </form>
        </main>
      </div>
    </div>
  )
}

export default Login