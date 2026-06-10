export default function MasteryScreen({ interest, topic, onReset }) {
  return (
    <div style={{ animation: 'fadeSlideIn 0.5s ease', textAlign: 'center', paddingTop: '60px' }}>
      {/* Celebration */}
      <div
        style={{
          fontSize: '6rem',
          marginBottom: '24px',
          animation: 'celebratePulse 0.8s ease',
        }}
      >
        🏆
      </div>

      <h1
        className="text-4xl font-extrabold"
        style={{
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #4CAF50, #29B6F6, #7C4DFF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Mastery Achieved!
      </h1>

      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          maxWidth: '500px',
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}
      >
        You successfully defended your understanding of{' '}
        <strong style={{ color: 'var(--accent-blue)' }}>{topic.name}</strong> using the world of{' '}
        <strong style={{ color: interest.color }}>{interest.name} {interest.emoji}</strong>.
        <br />
        The AI confirmed you truly understand this concept!
      </p>

      {/* Stats Card */}
      <div
        className="glass-card"
        style={{
          maxWidth: '500px',
          margin: '0 auto 40px',
          padding: '32px',
        }}
      >
        <h3 className="font-semibold text-lg" style={{ marginBottom: '20px', color: 'var(--accent-green)' }}>
          📊 Session Summary
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-purple)' }}>✓</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>
              Interest Matched
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-blue)' }}>✓</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>
              Lesson Personalized
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-green)' }}>✓</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>
              Knowledge Defended
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn-primary"
          onClick={onReset}
          style={{ fontSize: '1rem', padding: '14px 36px' }}
        >
          🔄 Learn Another Topic
        </button>
        <button
          className="btn-secondary"
          onClick={onReset}
          style={{ fontSize: '1rem', padding: '14px 36px' }}
        >
          🎯 Try a Different Interest
        </button>
      </div>

      {/* Footer Quote */}
      <p
        style={{
          color: 'var(--text-secondary)',
          marginTop: '60px',
          fontSize: '0.85rem',
          fontStyle: 'italic',
        }}
      >
        "I cannot teach anybody anything. I can only make them think." — Socrates
      </p>
    </div>
  )
}
