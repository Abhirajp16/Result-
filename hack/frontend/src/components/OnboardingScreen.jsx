import { useState } from 'react'
import axios from 'axios'

const INTERESTS = [
  { id: 'minecraft', name: 'Minecraft', emoji: '⛏️', color: '#4CAF50', desc: 'Redstone, crafting & building' },
  { id: 'space', name: 'Space', emoji: '🚀', color: '#7C4DFF', desc: 'Astronauts, galaxies & rockets' },
  { id: 'cooking', name: 'Cooking', emoji: '🍳', color: '#FF7043', desc: 'Recipes, flavors & kitchens' },
  { id: 'soccer', name: 'Soccer', emoji: '⚽', color: '#29B6F6', desc: 'Goals, tactics & teamwork' },
  { id: 'gaming', name: 'Gaming', emoji: '🎮', color: '#E040FB', desc: 'Esports, strategy & quests' },
  { id: 'anime', name: 'Anime', emoji: '🎌', color: '#FF5252', desc: 'Stories, heroes & battles' },
]

const TOPICS = [
  { id: 'friction', name: 'Friction', subject: 'Physics', icon: '⚡' },
  { id: 'photosynthesis', name: 'Photosynthesis', subject: 'Biology', icon: '🌿' },
  { id: 'pythagoras', name: 'Pythagorean Theorem', subject: 'Mathematics', icon: '📐' },
  { id: 'world_war_2', name: 'World War II', subject: 'History', icon: '🌍' },
  { id: 'gravity', name: 'Gravity', subject: 'Physics', icon: '🍎' },
]

export default function OnboardingScreen({ onStart }) {
  const [selectedInterest, setSelectedInterest] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!selectedInterest || !selectedTopic) return
    setLoading(true)
    setError('')

    try {
      const res = await axios.post('/api/generate-lesson', {
        topic: selectedTopic.id,
        interest: selectedInterest.name,
      })
      onStart(selectedInterest, selectedTopic, res.data.rewritten_lesson)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate lesson. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ animation: 'fadeSlideIn 0.5s ease' }}>
      {/* Hero */}
      <div className="text-center" style={{ marginBottom: '48px' }}>
        <h1
          className="text-4xl font-extrabold"
          style={{
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #7C4DFF, #29B6F6, #E040FB)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Learn Through Your Passions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Choose what you love, pick a topic, and watch as AI transforms boring lessons into
          adventures you actually want to explore.
        </p>
      </div>

      {/* Step 1: Choose Interest */}
      <div style={{ marginBottom: '48px' }}>
        <h2 className="text-xl font-semibold" style={{ marginBottom: '20px' }}>
          <span style={{ color: 'var(--accent-purple)' }}>01.</span> What do you love?
        </h2>
        <div
          className="interest-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          {INTERESTS.map((interest) => (
            <div
              key={interest.id}
              className={`glass-card interest-card ${selectedInterest?.id === interest.id ? 'selected' : ''}`}
              onClick={() => setSelectedInterest(interest)}
              style={
                selectedInterest?.id === interest.id
                  ? { borderColor: interest.color, boxShadow: `0 0 30px ${interest.color}33` }
                  : {}
              }
            >
              <span className="emoji">{interest.emoji}</span>
              <div className="font-semibold text-lg" style={{ marginBottom: '4px' }}>
                {interest.name}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{interest.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Choose Topic */}
      <div style={{ marginBottom: '48px' }}>
        <h2 className="text-xl font-semibold" style={{ marginBottom: '20px' }}>
          <span style={{ color: 'var(--accent-blue)' }}>02.</span> What do you want to learn?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {TOPICS.map((topic) => (
            <div
              key={topic.id}
              className={`glass-card topic-card ${selectedTopic?.id === topic.id ? 'selected' : ''}`}
              onClick={() => setSelectedTopic(topic)}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{topic.icon}</div>
              <div className="font-semibold">{topic.name}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{topic.subject}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      {error && (
        <div
          style={{
            color: 'var(--accent-red)',
            textAlign: 'center',
            marginBottom: '16px',
            fontSize: '0.9rem',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <div className="text-center">
        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={!selectedInterest || !selectedTopic || loading}
          style={{ fontSize: '1.1rem', padding: '16px 48px' }}
        >
          {loading ? (
            <span className="flex items-center gap-3">
              <span className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
              Transforming your lesson...
            </span>
          ) : (
            <>✨ Generate My Personalized Lesson</>
          )}
        </button>

        {selectedInterest && selectedTopic && (
          <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '0.85rem' }}>
            Learning <strong style={{ color: 'var(--accent-blue)' }}>{selectedTopic.name}</strong> through the world of{' '}
            <strong style={{ color: selectedInterest.color }}>{selectedInterest.name}</strong>
          </p>
        )}
      </div>
    </div>
  )
}
