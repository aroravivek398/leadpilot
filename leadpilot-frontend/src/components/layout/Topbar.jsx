import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { initials } from '../../utils/format'

function Topbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="user-chip">
      <span className="avatar" aria-hidden="true">{initials(user?.name)}</span>
      <span className="user-name">{user?.name || 'User'}</span>
      <button className="btn btn-sm" onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Topbar
