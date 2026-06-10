import ReactMarkdown from 'react-markdown'

export default function LessonScreen({ lesson, interest, topic, onEnterArena }) {
  return (
    <div style={{ animation: 'fadeSlideIn 0.5s ease' }}>
      {/* Header */}
      <div className="text-center" style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '50px',
            background: `${interest.color}22`,
            border: `1px solid ${interest.color}44`,
            marginBottom: '16px',
            fontSize: '0.9rem',
            color: interest.color,
          }}
        >
          <span>{interest.emoji}</span>
          <span>{topic.name} × {interest.name}</span>
        </div>
        <h1 className="text-3xl font-bold" style={{ marginBottom: '8px' }}>
          Your Personalized Lesson
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Read through this lesson carefully — you'll need to defend your knowledge next!
        </p>
      </div>

      {/* Lesson Content Card */}
      <div className="glass-card" style={{ marginBottom: '32px' }}>
        <div className="lesson-content">
          <ReactMarkdown>{lesson}</ReactMarkdown>
        </div>
      </div>

      {/* Enter Arena Button */}
      <div className="text-center">
        <button
          className="btn-primary"
          onClick={onEnterArena}
          style={{
            fontSize: '1.1rem',
            padding: '16px 48px',
            background: 'linear-gradient(135deg, #FF5252, #FF7043)',
          }}
        >
          ⚔️ Enter The Arena — Defend Your Knowledge
        </button>
        <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '0.85rem' }}>
          An AI {interest.name} expert will challenge you to prove you understood the lesson
        </p>
      </div>
    </div>
  )
}
