import { useEffect, useState } from 'react'

import PageShell, { PageState } from '../components/layout/PageShell'
import { getDashboard } from '../services/dashboardService'
import { formatCurrency } from '../utils/format'

import './pages.css'

function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboard()
        setDashboard(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading || error) {
    return (
      <PageShell title="Dashboard">
        <PageState error={error}>Loading dashboard...</PageState>
      </PageShell>
    )
  }

  const stages = Object.entries(dashboard.stageCounts || {})
  const maxCount = Math.max(1, ...stages.map(([, count]) => count))
const totalFollowUps =
  (dashboard.pendingFollowUps || 0) +
  (dashboard.overdueFollowUps || 0) +
  (dashboard.completedFollowUps || 0)
  const donePct = totalFollowUps ? Math.round((dashboard.completedFollowUps / totalFollowUps) * 100) : 0

  const stats = [
    { label: 'Total Leads', value: dashboard.totalLeads, tone: '' },
    { label: 'Pipeline Value', value: formatCurrency(dashboard.totalPipelineValue), tone: 'brand' },
    { label: 'Won Value', value: formatCurrency(dashboard.wonValue), tone: 'ok' },
    { label: 'Lost Value', value: formatCurrency(dashboard.lostValue), tone: 'err' },
  ]

  return (
    <PageShell title="Dashboard" subtitle="Your pipeline at a glance">
      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className={`card stat ${s.tone}`}>
            <span className="stat-label">{s.label}</span>
            <span className="stat-value">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="two-col">
        <section className="card">
          <h2 className="card-title">Lead Stages</h2>
          {stages.length === 0 ? (
            <div className="empty">No leads yet.</div>
          ) : (
            stages.map(([stage, count]) => (
              <div className="bar-row" key={stage}>
                <span>{stage}</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(count / maxCount) * 100}%` }} /></div>
                <span className="bar-count">{count}</span>
              </div>
            ))
          )}
        </section>

        <section className="card">
          <h2 className="card-title">Follow-ups <span className="muted">{donePct}% done</span></h2>
          <div className="bar-track" style={{ marginBottom: 12 }}><div className="bar-fill" style={{ width: `${donePct}%` }} /></div>
          <div className="follow-stat"><span className="muted">Pending</span><strong>{dashboard.pendingFollowUps}</strong></div>
          <div className="follow-stat">
  <span className="muted">Overdue</span>
  <strong>{dashboard.overdueFollowUps}</strong>
</div>

          <div className="follow-stat"><span className="muted">Completed</span><strong>{dashboard.completedFollowUps}</strong></div>
        </section>
      </div>
    </PageShell>
  )
}

export default Dashboard
