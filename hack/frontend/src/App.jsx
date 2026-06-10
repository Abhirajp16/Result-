import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import OnboardingScreen from './components/OnboardingScreen.jsx'
import LessonScreen from './components/LessonScreen.jsx'
import ArenaScreen from './components/ArenaScreen.jsx'
import MasteryScreen from './components/MasteryScreen.jsx'

function App() {
  // App state
  const [step, setStep] = useState(0) // 0=onboard, 1=lesson, 2=arena, 3=mastery
  const [selectedInterest, setSelectedInterest] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [lessonContent, setLessonContent] = useState('')

  const handleStartLesson = (interest, topic, lesson) => {
    setSelectedInterest(interest)
    setSelectedTopic(topic)
    setLessonContent(lesson)
    setStep(1)
  }

  const handleEnterArena = () => {
    setStep(2)
  }

  const handleMastery = () => {
    setStep(3)
  }

  const handleReset = () => {
    setStep(0)
    setSelectedInterest(null)
    setSelectedTopic(null)
    setLessonContent('')
  }

  return (
    <div className="min-h-screen">
      <Navbar step={step} onReset={handleReset} />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step-dot ${step === 0 ? 'active' : step > 0 ? 'done' : ''}`}></div>
          <div className={`step-dot ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}></div>
          <div className={`step-dot ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}></div>
          <div className={`step-dot ${step === 3 ? 'active' : ''}`}></div>
        </div>

        {step === 0 && (
          <OnboardingScreen onStart={handleStartLesson} />
        )}

        {step === 1 && (
          <LessonScreen
            lesson={lessonContent}
            interest={selectedInterest}
            topic={selectedTopic}
            onEnterArena={handleEnterArena}
          />
        )}

        {step === 2 && (
          <ArenaScreen
            interest={selectedInterest}
            topic={selectedTopic}
            onMastery={handleMastery}
          />
        )}

        {step === 3 && (
          <MasteryScreen
            interest={selectedInterest}
            topic={selectedTopic}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  )
}

export default App
