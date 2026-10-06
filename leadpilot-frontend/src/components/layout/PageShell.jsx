import { NavLink } from 'react-router-dom'
import Topbar from './Topbar'
import './Layout.css'

const Grid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
)
const Users = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.2 2.4 3.5 5.2" /></svg>
)
const Building = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M10 21v-4h4v4" /></svg>
)

function PageShell({ title, subtitle, actions, children }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">L</span><span className="brand-name">LeadPilot</span></div>
        <nav className="nav">
          <NavLink to="/" end><Grid /><span>Dashboard</span></NavLink>
          <NavLink to="/leads"><Users /><span>Leads</span></NavLink>
          <NavLink to="/companies"><Building /><span>Companies</span></NavLink>
        </nav>
      </aside>

      <div className="main-col">
        <header className="topbar">
          <div className="page-head">
            <h1>{title}</h1>
            {subtitle && <p className="muted">{subtitle}</p>}
          </div>
          <div className="top-actions">
            {actions}
            <Topbar />
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  )
}

export function PageState({ error, children }) {
  return (
    <div className="state">
      {error ? <div className="alert-error">{error}</div> : <><div className="spinner" />{children}</>}
    </div>
  )
}

export default PageShell
