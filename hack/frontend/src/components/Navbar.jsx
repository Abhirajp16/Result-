export default function Navbar({ step, onReset }) {
  const stepLabels = ['Choose Interest', 'Learn', 'Defend', 'Mastery']

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={onReset} style={{ cursor: 'pointer' }}>
        <span className="prism-icon">🔮</span>
        <span
          style={{
            background: 'linear-gradient(135deg, #7C4DFF, #29B6F6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Prism
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 500,
          }}
        >
          {stepLabels[step] || ''}
        </span>

        {step > 0 && (
          <button className="btn-secondary" onClick={onReset} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            ← Start Over
          </button>
        )}
      </div>
    </nav>
  )
}
