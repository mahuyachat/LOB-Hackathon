import { useEffect, useRef, useState } from 'react'
import { Clock, Eye, Phone, MessageSquare, Sparkles } from 'lucide-react'

export function SurveyFlowPage({ onBackToLanding }: { onBackToLanding: () => void }) {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutsRef = useRef<number[]>([])

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t))
    timeoutsRef.current = []
  }

  const addTimeout = (fn: () => void, delay: number) => {
    const t = window.setTimeout(fn, delay)
    timeoutsRef.current.push(t)
  }

  useEffect(() => {
    return () => clearAllTimeouts()
  }, [])

  const handleQuestionClick = (questionNum: number) => {
    if (isAnimating) return

    clearAllTimeouts()
    setSelectedQuestion(questionNum)
    setIsAnimating(true)

    // Show answer after delay
    addTimeout(() => {
      setIsAnimating(false)
    }, 3000)
  }

  const replayAnimation = () => {
    clearAllTimeouts()
    setSelectedQuestion(null)
    setIsAnimating(false)
  }

  return (
    <div style={{ display: 'grid', gridTemplateRows: '56px 1fr', height: '100vh', minWidth: '1280px', fontFamily: '"Open Sans", "Inter", system-ui, sans-serif' }}>
      {/* Topbar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '8px',
        background: '#ffffff',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 8px', height: '40px' }}>
          <div style={{ width: '24px', height: '24px', color: 'rgb(54,148,252)', display: 'grid', placeItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 23.848" fill="none">
              <path d="M 23.719 5.814 C 23.876 5.815 24.002 5.94 24 6.096 C 23.849 15.818 15.918 23.698 6.134 23.848 C 5.978 23.849 5.851 23.724 5.851 23.568 L 5.851 19.309 C 5.851 19.156 5.975 19.034 6.129 19.03 C 13.245 18.884 19.005 13.16 19.152 6.09 C 19.156 5.936 19.279 5.813 19.433 5.813 L 23.719 5.814 Z" fill="currentColor" fillRule="nonzero"/>
              <path d="M 12.256 0.001 C 13.871 0.001 15.18 1.302 15.181 2.906 C 15.181 4.511 13.872 5.812 12.256 5.813 C 10.64 5.813 9.33 4.511 9.33 2.906 C 9.33 1.302 10.64 0.001 12.256 0.001 Z" fill="currentColor" fillRule="nonzero"/>
              <path d="M 2.926 0 C 4.541 0 5.85 1.301 5.851 2.905 C 5.851 4.509 4.541 5.811 2.926 5.812 C 1.31 5.812 0 4.51 0 2.905 C 0 1.301 1.31 0 2.926 0 Z" fill="currentColor" fillRule="nonzero"/>
            </svg>
          </div>
          <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '16px', letterSpacing: '-0.01em', color: 'rgba(0,0,0,0.8)' }}>
            CXone Agent
          </div>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          height: '32px',
          padding: '0 12px',
          borderRadius: '999px',
          background: 'rgb(238,245,254)',
          color: 'rgb(24,91,164)',
          fontWeight: 600,
          fontSize: '13px'
        }}>
          <Clock size={14} />
          Survey monitor · #a2964 James C.
        </div>

        <div style={{ flex: 1 }}></div>

        <button onClick={onBackToLanding} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          height: '32px',
          padding: '0 12px',
          borderRadius: '8px',
          background: '#ffffff',
          color: 'rgb(24,91,164)',
          border: '1px solid rgba(0,0,0,0.1)',
          fontWeight: 600,
          fontSize: '13px',
          cursor: 'pointer',
          fontFamily: 'inherit'
        }}>
          ← Back to landing
        </button>

        <button onClick={replayAnimation} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          height: '32px',
          padding: '0 12px',
          borderRadius: '8px',
          background: 'rgb(54,148,252)',
          color: '#ffffff',
          border: 'none',
          fontWeight: 600,
          fontSize: '13px',
          cursor: 'pointer',
          fontFamily: 'inherit'
        }}>
          ↻ Replay
        </button>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          height: '32px',
          padding: '0 12px',
          borderRadius: '999px',
          background: '#ffffff',
          color: 'rgba(0,0,0,0.85)',
          border: '1px solid rgba(0,0,0,0.1)',
          fontWeight: 600,
          fontSize: '13px'
        }}>
          <Eye size={14} style={{ color: 'rgba(0,0,0,0.6)' }} />
          Supervisor view · Maya R.
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          height: '32px',
          padding: '0 12px',
          borderRadius: '999px',
          background: '#ffffff',
          color: 'rgba(0,0,0,0.85)',
          border: '1px solid rgba(0,0,0,0.1)',
          fontWeight: 600,
          fontSize: '13px'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedQuestion !== null && !isAnimating ? 'rgb(39,138,51)' : 'rgb(214,57,57)' }}></span>
          {selectedQuestion !== null && !isAnimating ? 'Complete' : 'Live'} · 00:14
        </div>
      </header>

      {/* Main */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '256px 1fr 320px 320px',
        gap: '16px',
        padding: '20px',
        minHeight: 0,
        background: 'rgb(245,247,249)'
      }}>
        {/* Sidebar */}
        <aside style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          overflow: 'auto'
        }}>
          <div>
            <h3 style={{
              margin: '0 8px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.46)'
            }}>Sessions</h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '8px 0 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                color: 'rgb(24,91,164)',
                fontSize: '13px',
                fontWeight: 600,
                borderLeft: '2px solid rgb(54,148,252)',
                borderRadius: 0,
                paddingLeft: '8px'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedQuestion !== null && !isAnimating ? 'rgb(39,138,51)' : 'rgb(214,57,57)' }}></span>
                #a2964 · James C.
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '8px',
                color: 'rgba(0,0,0,0.85)',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(0,0,0,0.25)' }}></span>
                #a2965 · Rachel W.
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '8px',
                color: 'rgba(0,0,0,0.85)',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(0,0,0,0.25)' }}></span>
                #a2966 · Parker W.
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{
              margin: '0 8px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.46)'
            }}>Channels</h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '8px 0 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '8px',
                color: 'rgba(0,0,0,0.85)',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                <Phone size={14} style={{ color: 'rgba(0,0,0,0.6)' }} />
                Voice · <span style={{ color: 'rgba(0,0,0,0.46)' }}>6 active</span>
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '8px',
                color: 'rgba(0,0,0,0.85)',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                <MessageSquare size={14} style={{ color: 'rgba(0,0,0,0.6)' }} />
                Chat · <span style={{ color: 'rgba(0,0,0,0.46)' }}>6 active</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Center: Q&A monitor */}
        <section style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{
            color: 'rgba(0,0,0,0.46)',
            fontSize: '13px',
            padding: '4px 4px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>Sessions</span><span>/</span>
            <span style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 600 }}>Retention Voice Q2</span><span>/</span>
            <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '12.5px' }}>1c4fa089…a2964</span>
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            padding: '36px 40px 40px',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <h1 style={{
                  fontFamily: 'Inter',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'rgba(0,0,0,0.9)',
                  letterSpacing: '-0.01em',
                  margin: 0,
                  lineHeight: 1.3
                }}>Probable list of questions based on intents identified</h1>
                <p style={{ color: 'rgba(0,0,0,0.6)', marginTop: '4px', fontSize: '13px' }}>
                  Generated from this session's detected intents. Each question is justified by the intent that triggered it.
                </p>
              </div>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '999px',
                background: 'rgb(243,238,253)',
                color: 'rgb(120,86,186)',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                <Sparkles size={12} />
                Intent-driven
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: 'rgba(0,0,0,0.6)',
              margin: '18px 0 -4px',
              fontSize: '13px'
            }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '999px',
                background: 'rgb(54,148,252)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: '11px',
                fontFamily: 'Inter',
                flexShrink: 0
              }}>i</div>
              <div>
                <strong style={{ color: 'rgba(0,0,0,0.9)', fontWeight: 700 }}>These are probable questions</strong> — based on detected intents. They may adapt in real time as the customer responds.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '22px' }}>
              {/* Q0 - Welcome */}
              <div onClick={() => handleQuestionClick(0)} style={{ cursor: 'pointer' }}>
                <QuestionCard
                  num={0}
                  status={selectedQuestion !== null && selectedQuestion >= 0 ? 'done' : 'inactive'}
                  text="Welcome message played · auto-advanced to Question 1"
                />
              </div>

              {/* Q1 */}
              <div onClick={() => handleQuestionClick(1)} style={{ cursor: 'pointer' }}>
                <QuestionCard
                  num={1}
                  status={selectedQuestion === 1 && isAnimating ? 'active' : (selectedQuestion !== null && selectedQuestion >= 1 ? 'done' : 'inactive')}
                  text="On a scale of 1 to 5, how satisfied were you with Rachel's handling of your request today?"
                  answer={selectedQuestion !== null && selectedQuestion >= 1 && !isAnimating ? '3 · Moderately satisfied' : undefined}
                  intentTag="Billing dispute"
                  intentWhy="Customer flagged an unrecognized $87 charge — surveying satisfaction with the resolution."
                />
              </div>

              {/* Q2 */}
              <div onClick={() => handleQuestionClick(2)} style={{ cursor: 'pointer' }}>
                <QuestionCard
                  num={2}
                  status={selectedQuestion === 2 && isAnimating ? 'active' : (selectedQuestion !== null && selectedQuestion >= 2 ? 'done' : 'inactive')}
                  text="Did the transition from the automated system to a human agent cause any frustration?"
                  answer={selectedQuestion !== null && selectedQuestion >= 2 && !isAnimating ? '"Yes, I had to repeat myself, and it felt like the system wasn\'t listening..."' : undefined}
                  intentTag="Bot-to-human handoff friction"
                  intentWhy="Adapted from a 3/5 rating — probing handoff experience as a likely friction point."
                  answerNegative={true}
                />
              </div>

              {/* Q3 */}
              <div onClick={() => handleQuestionClick(3)} style={{ cursor: 'pointer' }}>
                <QuestionCard
                  num={3}
                  status={selectedQuestion === 3 && isAnimating ? 'active' : (selectedQuestion !== null && selectedQuestion >= 3 ? 'done' : 'inactive')}
                  text="Were you left feeling unsure about what went wrong with your issue?"
                  answer={selectedQuestion !== null && selectedQuestion >= 3 && !isAnimating ? '"Yes, but Rachel was able to resolve my query."' : undefined}
                  intentTag="Explanation clarity"
                  intentWhy="Adapted from a 3/5 rating — checking whether the cause was clearly communicated."
                  answerMixed={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Right: Session panel */}
        <aside style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '12px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          padding: '20px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          overflow: 'auto'
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'rgba(0,0,0,0.9)'
          }}>Session</h2>
          <div style={{ color: 'rgba(0,0,0,0.46)', fontSize: '12.5px', margin: '4px 0 12px' }}>
            Routed in from CXone Agent · Rachel Whitman
          </div>

          <KeyValue k="Customer" v="James Carter" />
          <KeyValue k="Number" v="+1 (253) 334-8998" />
          <KeyValue k="Campaign" v="Retention Voice Q2" />
          <KeyValue k="Model · version" v="Telco tuned · v4 · Weights" />
          <KeyValue k="Started" v="9:15:42 AM" />
          <KeyValue k="Channel" v="Voice · IVR" />

          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #eef0f3' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'rgba(0,0,0,0.9)' }}>Audio input</div>
            <div style={{ color: 'rgba(0,0,0,0.46)', fontSize: '12.5px', marginTop: '2px' }}>Speech recognition only · no keypad input</div>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '4px',
              height: '56px',
              marginTop: '14px'
            }}>
              {[28, 62, 42, 70, 84, 36, 52, 40, 74, 80, 38].map((height, i) => (
                <span key={i} style={{
                  flex: 1,
                  minWidth: '8px',
                  background: height > 60 ? 'rgb(120,86,186)' : 'rgb(231,222,250)',
                  borderRadius: '2px',
                  height: `${height}%`
                }}></span>
              ))}
            </div>
          </div>
        </aside>

        {/* Phone Mockup */}
        <div style={{
          background: 'rgb(245,247,249)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px'
        }}>
          <div style={{
            width: '280px',
            height: '600px',
            background: 'white',
            borderRadius: '32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            {/* Notch */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '28px',
              background: 'black',
              borderRadius: '0 0 16px 16px',
              zIndex: 10
            }}></div>

            {/* Status Bar */}
            <div style={{
              height: '44px',
              background: 'white',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '0 16px 8px',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#1f2937',
              fontWeight: 500
            }}>
              <div>9:14</div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" style={{ color: '#1f2937' }}>
                  <path d="M0 10h2v2H0v-2zm4-4h2v6H4V6zm4-4h2v10H8V2zm4 2h2v8h-2V4z"/>
                </svg>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#1f2937' }}>
                  <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                  <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                  <circle cx="12" cy="20" r="1"/>
                </svg>
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: '#1f2937' }}>
                  <rect x="1" y="1" width="18" height="10" rx="2"/>
                  <path d="M20 4v4"/>
                </svg>
              </div>
            </div>

            {/* Header */}
            <div style={{
              background: '#f9fafb',
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '2px' }}>
                NICE Customer Survey
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                automated · adaptive flow · 00:42
              </div>
            </div>

            {/* Voice Call UI */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 20px 24px',
              background: 'white'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                {/* Avatar */}
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, rgb(120,86,186), rgb(147,112,219))',
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  fontWeight: 700,
                  color: 'white',
                  boxShadow: '0 10px 40px rgba(120,86,186,0.3)'
                }}>SA</div>

                {/* Call Info */}
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '4px', textAlign: 'center' }}>
                  Survey Agent
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px', textAlign: 'center' }}>
                  Voice Survey · IVR
                </div>

                {/* Question Display */}
                {selectedQuestion !== null && (
                  <div style={{
                    background: '#f3f4f6',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    maxWidth: '220px',
                    textAlign: 'center',
                    animation: 'messageSlideIn 0.3s ease-out'
                  }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {isAnimating ? 'Asking...' : 'Question ' + selectedQuestion}
                    </div>
                    <div style={{ fontSize: '12px', color: '#1f2937', lineHeight: 1.3 }}>
                      {selectedQuestion === 1 && 'On a scale of 1 to 5, how satisfied were you?'}
                      {selectedQuestion === 2 && 'Did the transition cause any frustration?'}
                      {selectedQuestion === 3 && 'Were you left feeling unsure?'}
                    </div>
                    {!isAnimating && selectedQuestion > 0 && (
                      <div style={{
                        marginTop: '8px',
                        paddingTop: '8px',
                        borderTop: '1px solid #d1d5db',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#10b981'
                      }}>
                        ✓ Response captured
                      </div>
                    )}
                  </div>
                )}

                {/* Audio Waveform */}
                {isAnimating && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: '32px',
                    marginBottom: '20px'
                  }}>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} style={{
                        width: '4px',
                        background: 'rgb(120,86,186)',
                        borderRadius: '2px',
                        animation: `waveformBounce 1s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`
                      }}></div>
                    ))}
                  </div>
                )}

                {/* Timer */}
                <div style={{
                  fontSize: '28px',
                  fontWeight: 300,
                  color: '#1f2937',
                  fontVariantNumeric: 'tabular-nums',
                  marginBottom: '24px',
                  letterSpacing: '0.05em'
                }}>
                  {selectedQuestion === null ? '00:00' : `00:${String(selectedQuestion * 15).padStart(2, '0')}`}
                </div>
              </div>

              {/* Call Controls */}
              <div style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                paddingBottom: '8px'
              }}>
                <button style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: '#f3f4f6',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  </svg>
                </button>

                <button style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: selectedQuestion !== null && !isAnimating ? '#10b981' : '#10b981',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 2 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.79a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.29-1.29a2 2 0 0 1 2.11-.45c.89.35 1.83.59 2.79.72A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </button>

                <button style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: '#f3f4f6',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5 6 9H2v6h4l5 4V5zM15 9a4 4 0 0 1 0 6"/>
                  </svg>
                </button>
              </div>

              {/* Hint Text */}
              {selectedQuestion === null && (
                <div style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  textAlign: 'center',
                  maxWidth: '200px',
                  marginTop: '8px'
                }}>
                  Click a question card to see it in action
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuestionCard({ num, status, text, answer, intentTag, intentWhy, answerNegative, answerMixed }: {
  num: number
  status: 'active' | 'done' | 'inactive'
  text: string
  answer?: string
  intentTag?: string
  intentWhy?: string
  answerNegative?: boolean
  answerMixed?: boolean
}) {
  const cardStyle: React.CSSProperties = {
    border: status === 'active' ? '1.5px solid rgba(120,86,186,.45)' : '1px solid rgba(0,0,0,0.1)',
    background: status === 'active' ? 'rgb(243,238,253)' : '#ffffff',
    borderRadius: '12px',
    padding: '20px 22px',
    display: 'grid',
    gridTemplateColumns: '32px 1fr',
    gap: '14px'
  }

  const numStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '999px',
    background: status === 'done' ? 'rgb(39,138,51)' : (status === 'active' ? 'rgb(120,86,186)' : 'rgb(245,247,249)'),
    color: status === 'inactive' ? 'rgba(0,0,0,0.6)' : '#fff',
    fontWeight: 700,
    fontSize: '14px',
    display: 'grid',
    placeItems: 'center',
    marginTop: '2px',
    border: status === 'inactive' ? '1px solid rgba(0,0,0,0.1)' : 'none',
    fontFamily: 'Inter'
  }

  return (
    <div style={cardStyle}>
      <div style={numStyle}>{num}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: 0 }}>
        <div style={{
          fontSize: '15px',
          lineHeight: 1.5,
          color: status === 'active' ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.85)',
          fontWeight: status === 'active' ? 600 : 500
        }}>{text}</div>

        {status === 'active' && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(0,0,0,0.6)',
            fontSize: '12.5px'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'rgb(120,86,186)',
              fontWeight: 600
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'rgb(120,86,186)',
                animation: 'pulse 1.4s ease-out infinite'
              }}></span>
              Awaiting input
            </span>
          </div>
        )}

        {answer && !answerNegative && !answerMixed && (
          <div style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px'
          }}>
            <span style={{ color: 'rgb(217,138,7)', fontWeight: 800, fontSize: '14px' }}>{answer.split('·')[0]}</span>
            <span style={{ color: 'rgb(217,138,7)', fontWeight: 700 }}>· {answer.split('·')[1]}</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '999px',
              padding: '4px 10px',
              color: 'rgba(0,0,0,0.6)',
              fontSize: '12.5px',
              fontStyle: 'italic'
            }}>
              Speech · "I'd say three out of five"
            </span>
          </div>
        )}

        {answer && answerNegative && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ color: 'rgb(214,57,57)', fontWeight: 600, fontSize: '13.5px', lineHeight: 1.5 }}>{answer}</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '999px',
              padding: '4px 10px',
              color: 'rgba(0,0,0,0.6)',
              fontSize: '12.5px'
            }}>
              Speech
            </span>
          </div>
        )}

        {answer && answerMixed && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 600, fontSize: '13.5px', lineHeight: 1.5 }}>{answer}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                background: 'rgba(214,57,57,.1)',
                color: 'rgb(214,57,57)'
              }}>Issue Clarity −34</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 700,
                background: 'rgba(39,138,51,.12)',
                color: 'rgb(39,138,51)'
              }}>Agent Resolution +68</span>
            </div>
          </div>
        )}

        {intentTag && intentWhy && (
          <div style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px',
            background: status === 'active' ? 'rgba(255,255,255,0.7)' : '#ffffff',
            border: status === 'active' ? '1px solid rgba(120,86,186,.25)' : '1px solid rgba(0,0,0,0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: 'rgba(0,0,0,0.6)',
            fontSize: '12.5px'
          }}>
            <span style={{
              color: 'rgba(0,0,0,0.46)',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>Intent identified</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgb(253,236,236)',
              color: 'rgb(214,57,57)',
              border: '1px solid rgba(214,57,57,.35)',
              fontWeight: 700,
              fontSize: '12px',
              padding: '3px 8px',
              borderRadius: '999px'
            }}>{intentTag}</span>
            <span>{intentWhy}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function KeyValue({ k, v }: { k: string; v: string }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '10px 16px',
      padding: '12px 0',
      borderTop: '1px solid #eef0f3',
      alignItems: 'baseline'
    }}>
      <span style={{ color: 'rgba(0,0,0,0.6)', fontSize: '13px' }}>{k}</span>
      <span style={{ color: 'rgba(0,0,0,0.85)', fontSize: '13px', fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{v}</span>
    </div>
  )
}
