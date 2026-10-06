import { useEffect, useMemo, useState } from 'react'

import PageShell, { PageState } from '../components/layout/PageShell'
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../services/companyService'

import './pages.css'

const EMPTY = { name: '', industry: '', website: '', phone: '', email: '', address: '' }

function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [query, setQuery] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setCompanies(await getCompanies())
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return companies
    return companies.filter((c) =>
      [c.name, c.industry, c.email, c.phone].some((v) =>
        String(v || '').toLowerCase().includes(q)
      )
    )
  }, [companies, query])

  const setField = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }))

  const openCreate = () => {
    setEditingId(null)
    setForm(EMPTY)
    setFormError('')
    setActionError('')
    setShowForm(true)
  }

  const openEdit = (company) => {
    setEditingId(company.id)
    setForm({
      name: company.name || '',
      industry: company.industry || '',
      website: company.website || '',
      phone: company.phone || '',
      email: company.email || '',
      address: company.address || '',
    })
    setFormError('')
    setActionError('')
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY)
    setFormError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setSaving(true)

    // khali optional fields ko null bhejte hain
    const payload = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim() || null])
    )

    try {
      if (editingId) {
        const updated = await updateCompany(editingId, payload)
        setCompanies((current) => current.map((c) => (c.id === editingId ? updated : c)))
      } else {
        const created = await createCompany(payload)
        setCompanies((current) => [created, ...current])
      }
      closeForm()
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (company) => {
    if (!window.confirm(`Delete "${company.name}"?`)) return

    setActionError('')

    try {
      await deleteCompany(company.id)
      setCompanies((current) => current.filter((c) => c.id !== company.id))
    } catch (error) {
      setActionError(error.message)
    }
  }

  if (loading || error) {
    return (
      <PageShell title="Companies">
        <PageState error={error}>Loading companies...</PageState>
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Companies"
      subtitle={`${companies.length} total`}
      actions={
        <button className="btn btn-primary" onClick={showForm ? closeForm : openCreate}>
          {showForm ? 'Close' : '+ New Company'}
        </button>
      }
    >
      {showForm && (
        <section className="card form-card">
          <h2 className="card-title">{editingId ? 'Edit Company' : 'Add Company'}</h2>

          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field span-all">
                <label htmlFor="c-name">Company Name</label>
                <input id="c-name" value={form.name} onChange={setField('name')} placeholder="e.g. Microsoft" maxLength={150} required />
              </div>
              <div className="field">
                <label htmlFor="c-industry">Industry</label>
                <input id="c-industry" value={form.industry} onChange={setField('industry')} placeholder="e.g. Software" maxLength={100} />
              </div>
              <div className="field">
                <label htmlFor="c-website">Website</label>
                <input id="c-website" value={form.website} onChange={setField('website')} placeholder="https://..." maxLength={255} />
              </div>
              <div className="field">
                <label htmlFor="c-phone">Phone</label>
                <input id="c-phone" value={form.phone} onChange={setField('phone')} placeholder="+91..." maxLength={30} />
              </div>
              <div className="field span-all">
                <label htmlFor="c-email">Email</label>
                <input id="c-email" type="email" value={form.email} onChange={setField('email')} placeholder="contact@company.com" maxLength={255} />
              </div>
              <div className="field span-all">
                <label htmlFor="c-address">Address</label>
                <textarea id="c-address" value={form.address} onChange={setField('address')} placeholder="Office address" maxLength={500} />
              </div>
            </div>

            {formError && <p className="alert-error" role="alert">{formError}</p>}

            <div className="form-actions">
              <button type="button" className="btn" onClick={closeForm}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Company'}
              </button>
            </div>
          </form>
        </section>
      )}

      {actionError && <p className="alert-error" role="alert" style={{ marginBottom: 16 }}>{actionError}</p>}

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Search by name, industry, email or phone"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No companies found.</div>
      ) : (
        <div className="card table-wrap">
          <table className="table static">
            <thead>
              <tr><th>Company</th><th>Industry</th><th>Email</th><th>Phone</th><th /></tr>
            </thead>
            <tbody>
              {filtered.map((company) => (
                <tr key={company.id}>
                  <td className="lead-name">{company.name}</td>
                  <td>{company.industry || '—'}</td>
                  <td>{company.email || '—'}</td>
                  <td>{company.phone || '—'}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-sm" onClick={() => openEdit(company)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(company)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  )
}

export default Companies