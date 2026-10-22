import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import PageShell from '../components/layout/PageShell'
import { askCrm, syncCrmIndex } from '../services/askService'

import './pages.css'

const EXAMPLES = [
  'Which leads are in the proposal stage?',
  'What follow-ups are pending this week?',
  'Summarize my conversations with my most valuable lead',
]

function AskCrm() {
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [asking, setAsking] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, asking])

  const ask = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || asking) return

    setError('')
    setNotice('')
    setQuestion('')
    setMessages((current) => [...current, { role: 'user', text: trimmed }])
    setAsking(true)

    try {
      const result = await askCrm(trimmed)
      setMessages((current) => [
        ...current,
        { role: 'assistant', text: result.answer, sources: result.sources || [] },
      ])
    } catch (err) {
      setError(err.message)
    } finally {
      setAsking(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    ask(question)
  }

  const handleSync = async () => {
    setError('')
    setNotice('')
    setSyncing(true)

    try {
      const result = await syncCrmIndex()
      setNotice(`Synced ${result.leadsIndexed} lead(s). You can ask questions now.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <PageShell
      title="Ask your CRM"
      subtitle="Ask questions about your leads, activities and follow-ups"
      actions={
        <button className="btn btn-sm" onClick={handleSync} disabled={syncing}>
          {syncing ? 'Syncing...' : 'Sync CRM data'}
        </button>
      }
    >
      <section className="card" style={{ display: 'grid', gap: 16 }}>
        {messages.length === 0 && (
          <div className="empty">
            <p>
              First time? Click <strong>Sync CRM data</strong> once, then ask a question.
              New changes are picked up automatically.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 14 }}>
              {EXAMPLES.map((example) => (
                <button key={example} className="btn btn-sm" onClick={() => ask(example)}>
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                justifySelf: message.role === 'user' ? 'end' : 'start',
                maxWidth: '80%',
                padding: '10px 14px',
                borderRadius: 12,
                background: message.role === 'user' ? 'var(--brand)' : 'var(--field)',
                color: message.role === 'user' ? '#fff' : 'inherit',
              }}
            >
              <p style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>

              {message.sources?.length > 0 && (
                <p className="meta" style={{ marginTop: 8 }}>
                  Based on:{' '}
                  {message.sources.map((source, i) => (
                    <span key={source.leadId}>
                      {i > 0 && ', '}
                      <Link to={`/leads/${source.leadId}`}>{source.leadName}</Link>
                    </span>
                  ))}
                </p>
              )}
            </div>
          ))}

          {asking && <p className="meta">Thinking...</p>}
          <div ref={endRef} />
        </div>

        {notice && <p className="meta">{notice}</p>}
        {error && (
          <p className="alert-error" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
          <input
            className="search"
            style={{ flex: 1 }}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask something like: which leads need a follow-up?"
            maxLength={500}
            aria-label="Your question"
          />
          <button className="btn btn-primary" type="submit" disabled={asking || !question.trim()}>
            Ask
          </button>
        </form>
      </section>
    </PageShell>
  )
}

export default AskCrm