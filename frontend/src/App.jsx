import { useState, useRef, useEffect, useCallback } from 'react'
import './App.css'

// ─── Mock AI Response Engine ──────────────────────────────────────────────────
const AI_PERSONAS = {
  ai1: {
    name: 'NeuralX Alpha',
    model: 'GPT-4o • OpenAI',
    avatar: 'N',
    color: 'ai1',
  },
  ai2: {
    name: 'GeminiFlash',
    model: 'Gemini 1.5 • Google',
    avatar: 'G',
    color: 'ai2',
  },
}

function generateAIResponse(question, aiKey) {
  const responses = {
    ai1: [
      `**Approach:** From a systems-thinking perspective, ${question.toLowerCase().replace('?','').trim()} can be broken down into distinct components.\n\nFirst, identify the core problem domain. Structure your solution by separating concerns: input validation, processing logic, and output formatting. Leverage proven patterns like MVC or dependency injection to keep components decoupled.\n\nImplement incrementally — start with a working skeleton, then add features layer by layer. Use automated tests at each stage to catch regressions early.`,

      `**Technical Analysis:** The most robust way to approach this is through a layered architecture.\n\nLayer 1: Data ingestion and normalization. Layer 2: Business logic encapsulation. Layer 3: Presentation or API surface.\n\nThis separation ensures maintainability and testability. I'd recommend starting with a clear interface contract before any implementation — this reduces integration friction significantly. Documentation-first development often yields more coherent systems.`,

      `**Solution Framework:** Breaking this into first principles — what is the desired outcome, what constraints exist, and what resources are available?\n\nOnce those are clear, map out the decision tree. For complex problems, use divide and conquer: solve subproblems independently, then compose. Prioritize correctness over premature optimization. Measure performance only after the solution is functionally complete.`,
    ],
    ai2: [
      `**Creative Take:** Rather than the traditional approach, let's flip the problem. ${question.toLowerCase().replace('?','').trim()} benefits enormously from rapid prototyping.\n\nBuild the smallest possible version in 20 minutes. Get feedback. Iterate. This empirical loop often surfaces requirements that upfront planning misses entirely.\n\nAlso consider the human element — who uses this? Empathy-driven design usually produces more elegant solutions than purely technical analysis. Keep the interface frictionless and the internals can be complex.`,

      `**Pragmatic Perspective:** Here's what actually works in production: simplicity wins. Start with the most naive solution that could possibly work.\n\nOnce that's stable, profile and optimize only the hot paths. Over-engineered solutions die in maintenance. Choose boring technology for infrastructure, reserve creativity for the product layer.\n\nDocument the *why*, not just the *what* — future-you will be grateful. And always build observability in from day one; debugging blind is painful.`,

      `**Fresh Angle:** The conventional wisdom here might be misleading. Consider an iterative, feedback-driven approach.\n\nUse feature flags to deploy incrementally to small user segments. Measure real-world impact with A/B testing rather than assumptions. Build minimal, compose maximally — small focused modules that do one thing well are far more reusable than monolithic solutions.\n\nFail fast in development, never in production. Your error handling should be as thoughtfully designed as your happy path.`,
    ],
  }

  const pool = responses[aiKey]
  return pool[Math.floor(Math.random() * pool.length)]
}

function generateJudgeVerdict(q, a1, a2) {
  const verdicts = [
    {
      winner: 'ai1',
      label: '🏆 NeuralX Alpha Wins',
      banner: 'ai1-wins',
      score1: Math.floor(Math.random() * 15) + 82,
      score2: Math.floor(Math.random() * 15) + 65,
      reasoning: `**Verdict: NeuralX Alpha edges ahead.** After evaluating both responses for accuracy, depth, and practical applicability, NeuralX Alpha's structured, layered approach provides a clearer mental model and actionable path forward.\n\nGeminiFlash offered creative insights worth considering, but NeuralX Alpha's systematic breakdown makes it easier to implement and verify. For complex technical challenges, structure wins over creativity.`,
    },
    {
      winner: 'ai2',
      label: '🏆 GeminiFlash Wins',
      banner: 'ai2-wins',
      score1: Math.floor(Math.random() * 15) + 65,
      score2: Math.floor(Math.random() * 15) + 82,
      reasoning: `**Verdict: GeminiFlash takes the round.** GeminiFlash's pragmatic, iterative philosophy is better aligned with real-world software development realities. The advice to "build the smallest thing that works" is timeless and avoids the trap of over-engineering.\n\nNeuralX Alpha's response is thorough but slightly academic. GeminiFlash's emphasis on observability and empirical feedback loops reflects seasoned engineering wisdom. Practical beats theoretical here.`,
    },
    {
      winner: 'tie',
      label: '🤝 It\'s a Tie',
      banner: 'tie',
      score1: Math.floor(Math.random() * 10) + 76,
      score2: Math.floor(Math.random() * 10) + 76,
      reasoning: `**Verdict: Remarkably even match.** Both AIs brought distinct strengths that complement each other. NeuralX Alpha excelled in technical rigor and structural clarity, while GeminiFlash shone with pragmatic wisdom and human-centered thinking.\n\nThe ideal solution combines both: use Alpha's architecture as your blueprint, apply Flash's iterative mindset during execution. Neither approach alone is sufficient — together they're powerful.`,
    },
  ]

  return verdicts[Math.floor(Math.random() * verdicts.length)]
}

// ─── Components ──────────────────────────────────────────────────────────────

function TypingDots({ color }) {
  return (
    <div className="typing-indicator">
      <div className={`typing-dot`} style={{ background: color }} />
      <div className={`typing-dot`} style={{ background: color, animationDelay: '0.15s' }} />
      <div className={`typing-dot`} style={{ background: color, animationDelay: '0.3s' }} />
    </div>
  )
}

function LoadingResponse() {
  return (
    <div className="loading-response">
      <div className="loading-grid">
        {['ai1', 'ai2'].map((key) => (
          <div key={key} className={`skeleton-card ${key}`}>
            <div className="skeleton-header">
              <div className="skeleton-circle" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div className="skeleton-line" style={{ width: '60%' }} />
                <div className="skeleton-line" style={{ width: '40%', height: 8 }} />
              </div>
            </div>
            <div className="skeleton-body">
              <TypingDots color={key === 'ai1' ? 'var(--ai1-color)' : 'var(--ai2-color)'} />
              <div className="skeleton-line" style={{ width: '90%' }} />
              <div className="skeleton-line" style={{ width: '75%' }} />
              <div className="skeleton-line" style={{ width: '82%' }} />
              <div className="skeleton-line" style={{ width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
      <div className="skeleton-card judge" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
        <div className="skeleton-header" style={{ background: 'var(--judge-light)' }}>
          <div className="skeleton-circle" style={{ borderRadius: 8 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div className="skeleton-line" style={{ width: '30%' }} />
            <div className="skeleton-line" style={{ width: '20%', height: 8 }} />
          </div>
        </div>
        <div className="skeleton-body">
          <TypingDots color="var(--judge-color)" />
          <div className="skeleton-line" style={{ width: '85%' }} />
          <div className="skeleton-line" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  )
}

function SolutionCard({ aiKey, answer, delay = 0 }) {
  const persona = AI_PERSONAS[aiKey]
  return (
    <div className={`solution-card ${aiKey}`} style={{ animationDelay: `${delay}s` }}>
      <div className={`solution-header ${aiKey}`}>
        <div className="ai-avatar">{persona.avatar}</div>
        <div>
          <div className="ai-name">{persona.name}</div>
          <div className="ai-model">{persona.model}</div>
        </div>
      </div>
      <div className="solution-body">
        {answer.split('\n\n').map((para, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        ))}
      </div>
    </div>
  )
}

function JudgeCard({ verdict, delay = 0.15 }) {
  return (
    <div className="judge-card" style={{ animationDelay: `${delay}s` }}>
      <div className="judge-header">
        <div className="judge-avatar">⚖️</div>
        <div>
          <div className="judge-title">AI Judge</div>
          <div className="judge-subtitle">Impartial Analysis Engine</div>
        </div>
      </div>
      <div className="judge-body">
        <div className={`verdict-banner ${verdict.banner}`}>
          <span className="verdict-icon">{verdict.winner === 'tie' ? '🤝' : '🏆'}</span>
          <span>{verdict.label}</span>
        </div>
        <div className="judge-reasoning">
          {verdict.reasoning.split('\n\n').map((para, i) => (
            <p key={i} style={{ marginBottom: i < verdict.reasoning.split('\n\n').length - 1 ? 10 : 0 }}
              dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </div>
        <div className="scores-row">
          <div className="score-pill ai1">
            <div className="score-label">NeuralX Alpha</div>
            <div className="score-value">{verdict.score1}</div>
          </div>
          <div className="score-pill ai2">
            <div className="score-label">GeminiFlash</div>
            <div className="score-value">{verdict.score2}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BattleMessage({ message }) {
  return (
    <div className="battle-response">
      <div className="solutions-grid">
        <SolutionCard aiKey="ai1" answer={message.ai1} delay={0} />
        <SolutionCard aiKey="ai2" answer={message.ai2} delay={0.1} />
      </div>
      <JudgeCard verdict={message.verdict} delay={0.2} />
    </div>
  )
}

const SUGGESTIONS = [
  'How do I scale a web application?',
  'Explain async/await vs Promises',
  'Best practices for REST API design',
  'How to optimize database queries?',
  'What is dependency injection?',
  'How to handle authentication securely?',
]

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = useCallback(async (questionOverride) => {
    const question = questionOverride || input.trim()
    if (!question || isLoading) return

    setInput('')
    setIsLoading(true)

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: question }])

    // Simulate AI processing delay (1.5–2.5 seconds)
    const delay = 1500 + Math.random() * 1000
    await new Promise(r => setTimeout(r, delay))

    const ai1Answer = generateAIResponse(question, 'ai1')
    const ai2Answer = generateAIResponse(question, 'ai2')
    const verdict = generateJudgeVerdict(question, ai1Answer, ai2Answer)

    setMessages(prev => [...prev, {
      type: 'battle',
      question,
      ai1: ai1Answer,
      ai2: ai2Answer,
      verdict,
    }])
    setIsLoading(false)
  }, [input, isLoading])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handleTextareaInput = (e) => {
    setInput(e.target.value)
    // Auto resize
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <div className="logo-icon">⚔️</div>
          <div className="logo-text">
            <span className="logo-title">AI Battle Arena</span>
            <span className="logo-subtitle">Dual AI · Judge Decision</span>
          </div>
        </div>
        <div className="header-badges">
          <div className="badge badge-ai1">
            <div className="badge-dot" />
            NeuralX Alpha
          </div>
          <div className="badge badge-ai2">
            <div className="badge-dot" />
            GeminiFlash
          </div>
          <div className="badge badge-judge">
            <div className="badge-dot" />
            AI Judge
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="messages-container">
        {messages.length === 0 && !isLoading ? (
          <div className="empty-state">
            <div className="empty-icon">⚔️</div>
            <h1 className="empty-title">Two AIs Enter. One Wins.</h1>
            <p className="empty-subtitle">
              Ask any question and watch <strong>NeuralX Alpha</strong> vs <strong>GeminiFlash</strong> battle it out.
              An impartial AI Judge will decide who answered best.
            </p>
            <div className="empty-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="suggestion-chip"
                  onClick={() => handleSend(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              if (msg.type === 'user') {
                return (
                  <div key={idx} className="user-message-wrapper">
                    <div>
                      <div className="user-label">
                        <span>👤</span> You
                      </div>
                      <div className="user-message">{msg.text}</div>
                    </div>
                  </div>
                )
              }
              return <BattleMessage key={idx} message={msg} />
            })}
            {isLoading && <LoadingResponse />}
          </>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer className="input-area">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            className="input-field"
            rows={1}
            value={input}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything — let the AIs battle it out..."
            disabled={isLoading}
          />
          <button
            className="send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            title="Send (Enter)"
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
        <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
      </footer>
    </div>
  )
}
