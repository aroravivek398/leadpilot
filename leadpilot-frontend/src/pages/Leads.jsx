import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import PageShell, { PageState } from '../components/layout/PageShell'
import { createLead, getLeads } from '../services/leadService'
import {
  createCompany,
  getCompanies,
} from '../services/companyService'
import {
  createContact,
  getContactsByCompany,
} from '../services/contactService'
import {
  formatCurrency,
  labelize,
  stageClass,
} from '../utils/format'
import { useAuth } from '../context/AuthContext'

import './pages.css'

const SOURCES = [
  'WEBSITE',
  'REFERRAL',
  'COLD_CALL',
  'EMAIL',
  'LINKEDIN',
  'OTHER',
]

const STAGES = [
  'NEW',
  'CONTACTED',
  'INTERESTED',
  'PROPOSAL',
  'WON',
  'LOST',
]

function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [companies, setCompanies] = useState([])
  const [contacts, setContacts] = useState([])

  const [leadName, setLeadName] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [contactId, setContactId] = useState('')
  const [source, setSource] = useState('WEBSITE')
  const [stage, setStage] = useState('NEW')
  const [estimatedValue, setEstimatedValue] = useState('')
  const [notes, setNotes] = useState('')

  const [showNewCompany, setShowNewCompany] = useState(false)

  const [companyName, setCompanyName] = useState('')
  const [companyIndustry, setCompanyIndustry] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')

  const [companyCreateError, setCompanyCreateError] = useState('')
  const [companyCreateLoading, setCompanyCreateLoading] = useState(false)

  const [showNewContact, setShowNewContact] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactDesignation, setContactDesignation] = useState('')
  const [contactCreateError, setContactCreateError] = useState('')
  const [contactCreateLoading, setContactCreateLoading] = useState(false)

  const [createError, setCreateError] = useState('')
  const [createLoading, setCreateLoading] = useState(false)

  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const data = await getLeads()
        setLeads(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadLeads()
  }, [])

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getCompanies()
        setCompanies(data)
      } catch (error) {
        setCreateError(error.message)
      }
    }

    loadCompanies()
  }, [])
    useEffect(() => {
    if (!companyId) {
      setContacts([])
      setContactId('')
      return
    }

    const loadContacts = async () => {
      try {
        const data = await getContactsByCompany(companyId)
        setContacts(data)
        setContactId('')
      } catch (error) {
        setCreateError(error.message)
      }
    }

    loadContacts()
  }, [companyId])

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return leads
    }

    return leads.filter((lead) => {
      return [
        lead.name,
        lead.companyName,
        lead.contactName,
        lead.assignedUserName,
        lead.stage,
        lead.source,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(normalizedQuery)
        )
    })
  }, [leads, query])

  const resetCompanyForm = () => {
    setCompanyName('')
    setCompanyIndustry('')
    setCompanyWebsite('')
    setCompanyPhone('')
    setCompanyEmail('')
    setCompanyAddress('')
    setCompanyCreateError('')
  }

  const resetContactForm = () => {
    setContactName('')
    setContactEmail('')
    setContactPhone('')
    setContactDesignation('')
    setContactCreateError('')
  }

  const resetForm = () => {
    setLeadName('')
    setCompanyId('')
    setContactId('')
    setContacts([])
    setSource('WEBSITE')
    setStage('NEW')
    setEstimatedValue('')
    setNotes('')

    setShowNewCompany(false)
    resetCompanyForm()

    setShowNewContact(false)
    resetContactForm()

    setCreateError('')
  }

  const handleCreateCompany = async () => {
    setCompanyCreateError('')
    setCompanyCreateLoading(true)

    try {
      const newCompany = await createCompany({
        name: companyName,
        industry: companyIndustry,
        website: companyWebsite,
        phone: companyPhone,
        email: companyEmail,
        address: companyAddress,
      })

      setCompanies((currentCompanies) => [
        ...currentCompanies,
        newCompany,
      ])

      setCompanyId(String(newCompany.id))
      setShowNewCompany(false)

      resetCompanyForm()
    } catch (error) {
      setCompanyCreateError(error.message)
    } finally {
      setCompanyCreateLoading(false)
    }
  }

  const handleCreateContact = async () => {
    setContactCreateError('')

    if (!companyId) {
      setContactCreateError(
        'Please select a company first.'
      )
      return
    }

    setContactCreateLoading(true)

    try {
      const newContact = await createContact({
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        designation: contactDesignation,
        companyId: Number(companyId),
      })

      setContacts((currentContacts) => [
        ...currentContacts,
        newContact,
      ])

      setContactId(String(newContact.id))
      setShowNewContact(false)

      resetContactForm()
    } catch (error) {
      setContactCreateError(error.message)
    } finally {
      setContactCreateLoading(false)
    }
  }

  const handleCreateLead = async (event) => {
    event.preventDefault()

    setCreateError('')

    if (!user?.id) {
      setCreateError(
        'Session is outdated. Please logout and login again.'
      )
      return
    }

    setCreateLoading(true)

    try {
      const newLead = await createLead({
        name: leadName,
        companyId: Number(companyId),
        contactId: Number(contactId),
        assignedUserId: user.id,
        source,
        stage,
        estimatedValue: Number(estimatedValue),
        notes,
      })

      setLeads((currentLeads) => [
        newLead,
        ...currentLeads,
      ])

      resetForm()
      setShowForm(false)
    } catch (error) {
      setCreateError(error.message)
    } finally {
      setCreateLoading(false)
    }
  }

  if (loading) {
    return (
      <PageShell
        title="Leads"
        subtitle="Manage your sales pipeline."
      >
        <PageState text="Loading leads..." />
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell
        title="Leads"
        subtitle="Manage your sales pipeline."
      >
        <PageState
          error={error}
          actionLabel="Retry"
          onAction={() => window.location.reload()}
        />
      </PageShell>
    )
  }return(
      <PageShell
      title="Leads"
      subtitle="Manage your sales pipeline."
      actions={
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm((current) => !current)
            setCreateError('')
          }}
        >
          {showForm ? 'Close' : '+ Add Lead'}
        </button>
      }
    >
      <div className="toolbar">
        <input
        className="search"
        type="search"
            placeholder="Search leads..."
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
          />
        </div>
      

      {showForm && (
        <div className="card form-card">
          <div className="section-header">
            <div>
              <h2>Add New Lead</h2>
              <p className="muted">
                Create a lead and assign it to yourself.
              </p>
            </div>
          </div>

          <form
            className="form-stack"
            onSubmit={handleCreateLead}
          >
            <div className="form-grid">
              <div className="field">
                <label htmlFor="lead-name">
                  Lead Name
                </label>

                <input
                  id="lead-name"
                  type="text"
                  value={leadName}
                  onChange={(event) =>
                    setLeadName(event.target.value)
                  }
                  placeholder="e.g. Enterprise CRM Deal"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="lead-company">
                  Company
                </label>

                <div className="inline-actions">
                  <select
                    id="lead-company"
                    value={companyId}
                    onChange={(event) =>
                      setCompanyId(event.target.value)
                    }
                    disabled={showNewCompany}
                    required={!showNewCompany}
                  >
                    <option value="">
                      Select company
                    </option>

                    {companies.map((company) => (
                      <option
                        key={company.id}
                        value={company.id}
                      >
                        {company.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => {
                      setShowNewCompany(
                        (current) => !current
                      )
                      setCompanyCreateError('')
                      setCreateError('')
                    }}
                  >
                    {showNewCompany
                      ? 'Use Existing Company'
                      : '+ New Company'}
                  </button>
                </div>
              </div>

              {showNewCompany && (
                <div className="field span-all">
                  <div className="card">
                    <h3>New Company</h3>

                    <div className="form-stack">
                      <div className="form-grid">
                        <div className="field">
                          <label htmlFor="company-name">
                            Name
                          </label>

                          <input
                            id="company-name"
                            type="text"
                            value={companyName}
                            onChange={(event) =>
                              setCompanyName(
                                event.target.value
                              )
                            }
                            placeholder="Company name"
                            required
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="company-industry">
                            Industry
                          </label>

                          <input
                            id="company-industry"
                            type="text"
                            value={companyIndustry}
                            onChange={(event) =>
                              setCompanyIndustry(
                                event.target.value
                              )
                            }
                            placeholder="e.g. SaaS"
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="company-website">
                            Website
                          </label>

                          <input
                            id="company-website"
                            type="text"
                            value={companyWebsite}
                            onChange={(event) =>
                              setCompanyWebsite(
                                event.target.value
                              )
                            }
                            placeholder="https://example.com"
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="company-phone">
                            Phone
                          </label>

                          <input
                            id="company-phone"
                            type="text"
                            value={companyPhone}
                            onChange={(event) =>
                              setCompanyPhone(
                                event.target.value
                              )
                            }
                            placeholder="Phone number"
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="company-email">
                            Email
                          </label>

                          <input
                            id="company-email"
                            type="email"
                            value={companyEmail}
                            onChange={(event) =>
                              setCompanyEmail(
                                event.target.value
                              )
                            }
                            placeholder="company@example.com"
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="company-address">
                            Address
                          </label>

                          <input
                            id="company-address"
                            type="text"
                            value={companyAddress}
                            onChange={(event) =>
                              setCompanyAddress(
                                event.target.value
                              )
                            }
                            placeholder="Company address"
                          />
                        </div>
                      </div>

                      {companyCreateError && (
                        <p className="alert-error">
                          {companyCreateError}
                        </p>
                      )}

                      <div>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleCreateCompany}
                          disabled={companyCreateLoading}
                        >
                          {companyCreateLoading
                            ? 'Creating Company...'
                            : 'Create Company'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
                            <div className="field">
                <label htmlFor="lead-contact">
                  Contact
                </label>

                <div className="inline-actions">
                  <select
                    id="lead-contact"
                    value={contactId}
                    onChange={(event) =>
                      setContactId(event.target.value)
                    }
                    disabled={!companyId || showNewContact}
                    required={!showNewContact}
                  >
                    <option value="">
                      {companyId
                        ? 'Select contact'
                        : 'Select company first'}
                    </option>

                    {contacts.map((contact) => (
                      <option
                        key={contact.id}
                        value={contact.id}
                      >
                        {contact.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => {
                      if (!companyId) {
                        setCreateError(
                          'Please select a company first.'
                        )
                        return
                      }

                      setShowNewContact(
                        (current) => !current
                      )
                      setContactCreateError('')
                      setCreateError('')
                    }}
                  >
                    {showNewContact
                      ? 'Use Existing Contact'
                      : '+ New Contact'}
                  </button>
                </div>
              </div>

              {showNewContact && (
                <div className="field span-all">
                  <div className="card">
                    <h3>New Contact</h3>

                    <div className="form-stack">
                      <div className="form-grid">
                        <div className="field">
                          <label htmlFor="contact-name">
                            Name
                          </label>

                          <input
                            id="contact-name"
                            type="text"
                            value={contactName}
                            onChange={(event) =>
                              setContactName(
                                event.target.value
                              )
                            }
                            placeholder="Contact name"
                            required
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="contact-email">
                            Email
                          </label>

                          <input
                            id="contact-email"
                            type="email"
                            value={contactEmail}
                            onChange={(event) =>
                              setContactEmail(
                                event.target.value
                              )
                            }
                            placeholder="contact@example.com"
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="contact-phone">
                            Phone
                          </label>

                          <input
                            id="contact-phone"
                            type="text"
                            value={contactPhone}
                            onChange={(event) =>
                              setContactPhone(
                                event.target.value
                              )
                            }
                            placeholder="Phone number"
                          />
                        </div>

                        <div className="field">
                          <label htmlFor="contact-designation">
                            Designation
                          </label>

                          <input
                            id="contact-designation"
                            type="text"
                            value={contactDesignation}
                            onChange={(event) =>
                              setContactDesignation(
                                event.target.value
                              )
                            }
                            placeholder="e.g. CTO"
                          />
                        </div>
                      </div>

                      {contactCreateError && (
                        <p className="alert-error">
                          {contactCreateError}
                        </p>
                      )}

                      <div>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleCreateContact}
                          disabled={contactCreateLoading}
                        >
                          {contactCreateLoading
                            ? 'Creating Contact...'
                            : 'Create Contact'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="field">
                <label htmlFor="lead-source">
                  Source
                </label>

                <select
                  id="lead-source"
                  value={source}
                  onChange={(event) =>
                    setSource(event.target.value)
                  }
                  required
                >
                  <option value="WEBSITE">
                    Website
                  </option>
                  <option value="REFERRAL">
                    Referral
                  </option>
                  <option value="COLD_CALL">
                    Cold Call
                  </option>
                  <option value="EMAIL">
                    Email
                  </option>
                  <option value="LINKEDIN">
                    LinkedIn
                  </option>
                  <option value="OTHER">
                    Other
                  </option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="lead-stage">
                  Stage
                </label>

                <select
                  id="lead-stage"
                  value={stage}
                  onChange={(event) =>
                    setStage(event.target.value)
                  }
                  required
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">
                    Contacted
                  </option>
                  <option value="INTERESTED">
                    Interested
                  </option>
                  <option value="PROPOSAL">
                    Proposal
                  </option>
                  <option value="WON">Won</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>
                            <div className="field">
                <label htmlFor="lead-value">
                  Estimated Value
                </label>

                <input
                  id="lead-value"
                  type="number"
                  min="0"
                  value={estimatedValue}
                  onChange={(event) =>
                    setEstimatedValue(event.target.value)
                  }
                  placeholder="e.g. 500000"
                />
              </div>

              <div className="field span-all">
                <label htmlFor="lead-notes">
                  Notes
                </label>

                <textarea
                  id="lead-notes"
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  placeholder="Add notes about this lead..."
                  rows="4"
                />
              </div>
            </div>

            {createError && (
              <p className="alert-error">
                {createError}
              </p>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  resetForm()
                  setShowForm(false)
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={createLoading}
              >
                {createLoading
                  ? 'Creating Lead...'
                  : 'Create Lead'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="section-header">
          <div>
            <h2>All Leads</h2>
            <p className="muted">
              {filteredLeads.length} lead
              {filteredLeads.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <PageState
            text={
              query
                ? 'No leads match your search.'
                : 'No leads found.'
            }
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Stage</th>
                  <th>Source</th>
                  <th>Value</th>
                  <th>Assigned To</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() =>
                      navigate(`/leads/${lead.id}`)
                    }
                    className="clickable-row"
                  >
                    <td>
                      <strong>{lead.name}</strong>
                    </td>

                    <td>
                      {lead.companyName || '-'}
                    </td>

                    <td>
                      {lead.contactName || '-'}
                    </td>

                    <td>
                      <span
                        className={`badge ${stageClass(
                          lead.stage
                        )}`}
                      >
                        {labelize(lead.stage)}
                      </span>
                    </td>

                    <td>
                      {labelize(lead.source)}
                    </td>

                    <td>
                      {formatCurrency(
                        lead.estimatedValue
                      )}
                    </td>

                    <td>
                      {lead.assignedUserName || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  ) 
}

export default Leads