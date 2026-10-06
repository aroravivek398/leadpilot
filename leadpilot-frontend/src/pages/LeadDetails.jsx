import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import PageShell, { PageState } from '../components/layout/PageShell'

import {
  getLeadById,
  updateLead,
  deleteLead,
} from '../services/leadService'
import { getUsers } from '../services/userService'
import {
  getActivitiesByLead,
  createActivity,
} from '../services/activityService'
import {
  getFollowUpsByLead,
  createFollowUp,
  updateFollowUp,
} from '../services/followUpService'
import {
  formatCurrency,
  formatDateTime,
  labelize,
} from '../utils/format'
import './pages.css'

const SOURCES = ['WEBSITE', 'REFERRAL', 'COLD_CALL', 'EMAIL', 'LINKEDIN', 'OTHER']

function LeadDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
const [actionError, setActionError] = useState('')
const [deleting, setDeleting] = useState(false)
const [isEditing, setIsEditing] = useState(false)
const [editSaving, setEditSaving] = useState(false)
const [editForm, setEditForm] = useState({
  name: '',
  source: 'WEBSITE',
  estimatedValue: '',
  notes: '',
})
  const STAGES = [
  'NEW',
  'CONTACTED',
  'INTERESTED',
  'PROPOSAL',
  'WON',
  'LOST',
]

  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [activities, setActivities] = useState([])
  const [followUps, setFollowUps] = useState([])

  const [activityType, setActivityType] = useState('CALL')
  const [activityDescription, setActivityDescription] = useState('')
  const [activityDate, setActivityDate] = useState('')
  const [activityError, setActivityError] = useState('')
  const [activityLoading, setActivityLoading] = useState(false)

  const [followUpTitle, setFollowUpTitle] = useState('')
  const [followUpDescription, setFollowUpDescription] = useState('')
  const [followUpDueDate, setFollowUpDueDate] = useState('')
  const [followUpError, setFollowUpError] = useState('')
  const [followUpLoading, setFollowUpLoading] = useState(false)

  const handleStageChange = async (event) => {
  const newStage = event.target.value
  setActionError('')

  try {
    const updatedLead = await updateLead(id, {
      name: lead.name,
      source: lead.source,
      stage: newStage,
      estimatedValue: lead.estimatedValue,
      notes: lead.notes,
      companyId: lead.companyId,
      contactId: lead.contactId,
      assignedUserId: lead.assignedUserId,
    })

    setLead(updatedLead)
  } catch (error) {
    setActionError(error.message)
  }
}
const handleAssignedUserChange = async (event) => {
  const newUserId = Number(event.target.value)
  setActionError('')

  try {
    const updatedLead = await updateLead(id, {
      name: lead.name,
      source: lead.source,
      stage: lead.stage,
      estimatedValue: lead.estimatedValue,
      notes: lead.notes,
      companyId: lead.companyId,
      contactId: lead.contactId,
      assignedUserId: newUserId,
    })

    setLead(updatedLead)
  } catch (error) {
    setActionError(error.message)
  }
}
const handleDeleteLead = async () => {
  if (!window.confirm(`Delete "${lead.name}" and all its activities and follow-ups?`)) {
    return
  }

  setActionError('')
  setDeleting(true)

  try {
    await deleteLead(id)
    navigate('/leads')
  } catch (error) {
    setActionError(error.message)
    setDeleting(false)
  }
}
const startEdit = () => {
  setEditForm({
    name: lead.name || '',
    source: lead.source || 'WEBSITE',
    estimatedValue: lead.estimatedValue ?? '',
    notes: lead.notes || '',
  })
  setActionError('')
  setIsEditing(true)
}

const setEditField = (key) => (event) =>
  setEditForm((current) => ({ ...current, [key]: event.target.value }))

const handleSaveEdit = async (event) => {
  event.preventDefault()

  setActionError('')
  setEditSaving(true)

  try {
    const updatedLead = await updateLead(id, {
      name: editForm.name.trim(),
      source: editForm.source,
      stage: lead.stage,
      estimatedValue: Number(editForm.estimatedValue),
      notes: editForm.notes,
      companyId: lead.companyId,
      contactId: lead.contactId,
      assignedUserId: lead.assignedUserId,
    })

    setLead(updatedLead)
    setIsEditing(false)
  } catch (error) {
    setActionError(error.message)
  } finally {
    setEditSaving(false)
  }
}

  const handleCreateActivity = async (event) => {
    event.preventDefault()

    setActivityError('')
    setActivityLoading(true)

    try {
      const newActivity = await createActivity({
        type: activityType,
        description: activityDescription,
        activityDate,
        leadId: Number(id),
      })

      setActivities((currentActivities) => [
        newActivity,
        ...currentActivities,
      ])

      setActivityDescription('')
      setActivityDate('')
    } catch (error) {
      setActivityError(error.message)
    } finally {
      setActivityLoading(false)
    }
  }

  const handleCreateFollowUp = async (event) => {
    event.preventDefault()

    setFollowUpError('')
    setFollowUpLoading(true)

    try {
      const newFollowUp = await createFollowUp({
        title: followUpTitle,
        description: followUpDescription,
        dueDate: followUpDueDate,
        leadId: Number(id),
      })

      setFollowUps((currentFollowUps) => [
        ...currentFollowUps,
        newFollowUp,
      ])

      setFollowUpTitle('')
      setFollowUpDescription('')
      setFollowUpDueDate('')
    } catch (error) {
      setFollowUpError(error.message)
    } finally {
      setFollowUpLoading(false)
    }
  }

const handleCompleteFollowUp = async (followUpId) => {
  try {
    const updatedFollowUp = await updateFollowUp(
      followUpId,
      { status: 'COMPLETED' }
    )

    setFollowUps((currentFollowUps) =>
      currentFollowUps.map((followUp) =>
        followUp.id === followUpId
          ? updatedFollowUp
          : followUp
      )
    )
  } catch (error) {
    setFollowUpError(error.message)
  }
}

  useEffect(() => {
    const loadLead = async () => {
      try {
        const data = await getLeadById(id)
        setLead(data)

        const userData = await getUsers()
        setUsers(userData)
        console.log('USERS:', userData)

        const activityData = await getActivitiesByLead(id)
        setActivities(activityData)

        const followUpData = await getFollowUpsByLead(id)
        setFollowUps(followUpData)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadLead()
  }, [id])

  if (loading || error) {
    return (
      <PageShell title="Lead">
        <PageState error={error}>
          Loading lead...
        </PageState>
      </PageShell>
    )
  }

  return (
    <PageShell
      title={lead.name}
      subtitle={lead.companyName}
            actions={
        <div className="header-actions">
          <select
            className="stage-select"
            value={lead.stage}
            onChange={handleStageChange}
          >
            {STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>

          <button
            className="btn btn-sm btn-danger"
            onClick={handleDeleteLead}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      }
    >
      <Link to="/leads" className="back">
        ← Back to leads
      </Link>
            {actionError && (
        <p className="alert-error" role="alert" style={{ marginBottom: 16 }}>
          {actionError}
        </p>
      )}
            {isEditing && (
        <section className="card form-card">
          <h2 className="card-title">Edit Lead</h2>

          <form className="form-stack" onSubmit={handleSaveEdit}>
            <div className="form-grid">
              <div className="field span-all">
                <label htmlFor="edit-name">Lead Name</label>
                <input
                  id="edit-name"
                  value={editForm.name}
                  onChange={setEditField('name')}
                  maxLength={150}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="edit-value">Estimated Value (₹)</label>
                <input
                  id="edit-value"
                  type="number"
                  min="0"
                  value={editForm.estimatedValue}
                  onChange={setEditField('estimatedValue')}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="edit-source">Source</label>
                <select
                  id="edit-source"
                  value={editForm.source}
                  onChange={setEditField('source')}
                >
                  {SOURCES.map((source) => (
                    <option key={source} value={source}>
                      {labelize(source)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field span-all">
                <label htmlFor="edit-notes">Notes</label>
                <textarea
                  id="edit-notes"
                  value={editForm.notes}
                  onChange={setEditField('notes')}
                  maxLength={1000}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={editSaving}
              >
                {editSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="detail-grid">
        <section className="card">
          <h2 className="card-title">
  Details
  {!isEditing && (
    <button className="btn btn-sm" onClick={startEdit}>
      Edit
    </button>
  )}
</h2>

          <div className="info-list">
            <div className="info-item">
              <span>Estimated Value</span>
              <p>{formatCurrency(lead.estimatedValue)}</p>
            </div>

            <div className="info-item">
              <span>Source</span>
              <p>{lead.source || '—'}</p>
            </div>

            <div className="info-item">
              <span>Company</span>
              <p>{lead.companyName || '—'}</p>
            </div>

            <div className="info-item">
              <span>Contact</span>
              <p>{lead.contactName || '—'}</p>
            </div>

            <div className="info-item">
  <span>Assigned To</span>

  <select
  className="assigned-select"
  value={lead.assignedUserId || ''}
  onChange={handleAssignedUserChange}
>
  {users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))}
</select>
</div>

            <div className="info-item">
              <span>Notes</span>
              <p>{lead.notes || 'No notes'}</p>
            </div>
          </div>
        </section>

        <div className="stack">
          <section className="card">
            <h2 className="card-title">Activities</h2>

            <form
              className="form-stack"
              onSubmit={handleCreateActivity}
            >
              <div className="split">
                <div className="field">
                  <label htmlFor="act-type">Type</label>

                  <select
                    id="act-type"
                    value={activityType}
                    onChange={(event) =>
                      setActivityType(event.target.value)
                    }
                  >
                    <option value="CALL">Call</option>
                    <option value="MEETING">Meeting</option>
                    <option value="NOTE">Note</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="act-date">Date</label>

                  <input
                    id="act-date"
                    type="datetime-local"
                    value={activityDate}
                    onChange={(event) =>
                      setActivityDate(event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="act-desc">Description</label>

                <textarea
                  id="act-desc"
                  value={activityDescription}
                  onChange={(event) =>
                    setActivityDescription(event.target.value)
                  }
                  placeholder="Enter activity details"
                  required
                />
              </div>

              {activityError && (
                <p className="alert-error">
                  {activityError}
                </p>
              )}

              <div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={activityLoading}
                >
                  {activityLoading
                    ? 'Adding...'
                    : 'Add Activity'}
                </button>
              </div>
            </form>

            <div className="timeline">
              {activities.length === 0 ? (
                <div className="empty">
                  No activities found.
                </div>
              ) : (
                activities.map((activity) => (
                  <div
                    className="item"
                    key={activity.id}
                  >
                    <div className="item-head">
                      <span className="badge badge-blue">
                        {activity.type}
                      </span>

                      <span className="meta">
                        {formatDateTime(
                          activity.activityDate
                        )}
                      </span>
                    </div>

                    <p>{activity.description}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="card">
            <h2 className="card-title">Follow-ups</h2>

            <form
              className="form-stack"
              onSubmit={handleCreateFollowUp}
            >
              <div className="split">
                <div className="field">
                  <label htmlFor="fu-title">Title</label>

                  <input
                    id="fu-title"
                    type="text"
                    value={followUpTitle}
                    onChange={(event) =>
                      setFollowUpTitle(event.target.value)
                    }
                    placeholder="e.g. Send proposal"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="fu-due">Due Date</label>

                  <input
                    id="fu-due"
                    type="datetime-local"
                    value={followUpDueDate}
                    onChange={(event) =>
                      setFollowUpDueDate(event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="fu-desc">Description</label>

                <textarea
                  id="fu-desc"
                  value={followUpDescription}
                  onChange={(event) =>
                    setFollowUpDescription(event.target.value)
                  }
                  placeholder="Enter follow-up details"
                />
              </div>

              {followUpError && (
                <p className="alert-error">
                  {followUpError}
                </p>
              )}

              <div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={followUpLoading}
                >
                  {followUpLoading
                    ? 'Adding...'
                    : 'Add Follow-up'}
                </button>
              </div>
            </form>

            <div className="timeline">
              {followUps.length === 0 ? (
                <div className="empty">
                  No follow-ups found.
                </div>
              ) : (
                followUps.map((followUp) => (
                  <div
                    className={`item ${
  followUp.status === 'COMPLETED' ? 'done' : ''
} ${followUp.status === 'OVERDUE' ? 'overdue' : ''}`}
                    key={followUp.id}
                  >
                    <div className="item-head">
                      <span className="item-title">
                        {followUp.title}
                      </span>

                      <span
  className={`badge ${
    followUp.status === 'COMPLETED'
      ? 'badge-ok'
      : followUp.status === 'OVERDUE'
        ? 'badge-err'
        : 'badge-warn'
  }`}
>
  {followUp.status === 'COMPLETED'
    ? 'Completed'
    : followUp.status === 'OVERDUE'
      ? 'Overdue'
      : 'Pending'}
</span>
                    </div>

                    {followUp.description && (
                      <p>{followUp.description}</p>
                    )}

                    <div className="item-head">
                      <span className="meta">
                        Due{' '}
                        {formatDateTime(
                          followUp.dueDate
                        )}
                      </span>

                      {followUp.status !== 'COMPLETED' && (
                        <button
                          className="btn btn-sm"
                          onClick={() =>
                            handleCompleteFollowUp(
                              followUp.id
                            )
                          }
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  )
}

export default LeadDetails