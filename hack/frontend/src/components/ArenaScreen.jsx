import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

export default function ArenaScreen({ interest, topic, onMastery }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mastery, setMastery] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send opening challenge on mount
  useEffect(() => {
    sendMessage("Hello! I'm ready to learn about " + topic.name + ". Test me!", true)
  }, [])

  const sendMessage = async (text, isFirst = false) => {
    if (!text.trim()) return

    const userMessage = { role: 'user', content: text }
    const updatedMessages = isFirst ? [] : [...messages, userMessage]

    if (!isFirst) {
      setMessages((prev) => [...prev, userMessage])
    }

    setInput('')
    setLoading(true)

    try {
      const res = await axios.post('/api/chat', {
        topic: topic.id,
        interest: interest.id,
        message: text,
        history: updatedMessages,
      })

      const aiMessage = { role: 'assistant', content: res.data.response }
      setMessages((prev) => [...prev, ...(isFirst ? [userMessage] : []), aiMessage])

      if (res.data.mastery_achieved) {
        setMastery(true)
        setTimeout(() => onMastery(), 3000)
      }
    } catch (err) {
      const errorMsg = {
        role: 'assistant',
        content: '⚠️ Connection error. Make sure the backend is running on port 8000.',
      }
      setMessages((prev) => [...prev, ...(isFirst ? [userMessage] : []), errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!loading && input.trim()) {
      sendMessage(input)
    }
  }

  return (
    <div style={{ animation: 'fadeSlideIn 0.5s ease' }}>
      {/* Arena Header */}
      <div className="text-center" style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '50px',
            background: 'rgba(255, 82, 82, 0.15)',
            border: '1px solid rgba(255, 82, 82, 0.3)',
            marginBottom: '12px',
            fontSize: '0.9rem',
            color: '#FF5252',
          }}
        >
          ⚔️ The Arena
        </div>
        <h1 className="text-2xl font-bold" style={{ marginBottom: '8px' }}>
          Defend Your Knowledge
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          The AI {interest.name} expert will challenge you. Explain concepts — don't just guess!
        </p>
      </div>

      {/* Mastery Achieved Banner */}
      {mastery && (
        <div className="text-center" style={{ marginBottom: '16px' }}>
          <div className="mastery-badge">
            🏆 MASTERY ACHIEVED — Concept Proven!
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="glass-card chat-container">
        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role === 'user' ? 'user' : 'ai'}`}>
              {msg.role === 'assistant' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          ))}

          {loading && (
            <div className="message ai">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder={mastery ? '🏆 You mastered it!' : 'Explain your understanding...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || mastery}
            autoFocus
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !input.trim() || mastery}
            style={{ padding: '14px 24px' }}
          >
            Send
          </button>
        </form>
      </div>

      {/* Hint */}
      <div className="text-center" style={{ marginTop: '16px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          💡 Tip: Don't just say the answer — explain <em>why</em> it works using {interest.name} analogies!
        </p>
      </div>
    </div>
  )
}
