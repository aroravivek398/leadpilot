export const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`

export const formatDateTime = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export const stageClass = (stage = '') => {
  const s = String(stage).toLowerCase()
  if (s.includes('won')) return 'badge-ok'
  if (s.includes('lost')) return 'badge-err'
  if (s.includes('new') || s.includes('contact')) return 'badge-blue'
  if (s.includes('qualif') || s.includes('interest')) return 'badge-purple'
  if (s.includes('propos') || s.includes('negot')) return 'badge-warn'
  return 'badge-gray'
}

export const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || 'U'

export const labelize = (value = '') =>
  String(value).replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
