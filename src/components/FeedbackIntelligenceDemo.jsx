import { useState, useRef, useCallback, useEffect } from 'react';

const STAGES = 6;
const stageLabels = ['Intro','Survey','Moment 1','Moment 2','Moment 3','Under the Hood'];
const pillToStage = [0, 5, 1, 2, 3, 4];
const stageToPill = [0, 2, 3, 4, 5, 1];

// Each question carries 2 first-person disposition options
//   dispositions[0] = NEGATIVE (red tint)
//   dispositions[1] = POSITIVE (green tint)
// `matchesHypothesis: true` marks the disposition that confirms the AI's
// hypothesis (the one named in `context`). Used to color the ✓ on the
// external context card after the customer answers.
const contextualQuestions = {
  1: {
    title: '1-2 STARS: BILLING ERROR',
    topic: 'Billing Error',
    questions: [
      {
        text: 'Did the bot-to-human transfer feel like a waste of your time?',
        context: 'Bot-to-human transfers are a top 5 1–2★ driver. A Yes names the moment of frustration.',
        dispositions: [
          { label: 'It felt like a waste of time', tone: 'negative', matchesHypothesis: true,  verbatim: "I spent 10 minutes with the bot going in circles before it transferred me. By then I was already annoyed. The whole bot interaction felt pointless." },
          { label: 'It was worth the transfer',   tone: 'positive', matchesHypothesis: false, verbatim: "The bot did what it could and got me to the right person quickly. I didn't feel like my time was wasted." },
        ],
      },
      {
        text: 'Were you left guessing about what went wrong?',
        context: 'For failed resolutions, customers often blame communication. A Yes confirms the explanation gap.',
        dispositions: [
          { label: 'I had no idea what happened', tone: 'negative', matchesHypothesis: true,  verbatim: "Nobody explained why there was a billing error in the first place. I still don't really know what went wrong on their end." },
          { label: 'It was clearly explained',   tone: 'positive', matchesHypothesis: false, verbatim: "Rachel walked me through exactly what happened and why. I left the call understanding the full situation." },
        ],
      }
    ],
    why: 'Unexpected charges can damage trust even when resolved - understanding the emotional impact helps improve proactive error prevention'
  },
  2: {
    title: '1-2 STARS: BILLING ERROR',
    topic: 'Billing Error',
    questions: [
      {
        text: 'Did the bot-to-human transfer feel like a waste of your time?',
        context: 'Bot-to-human transfers are a top 5 1–2★ driver. A Yes names the moment of frustration.',
        dispositions: [
          { label: 'It felt like a waste of time', tone: 'negative', matchesHypothesis: true,  verbatim: "I spent 10 minutes with the bot going in circles before it transferred me. By then I was already annoyed. The whole bot interaction felt pointless." },
          { label: 'It was worth the transfer',   tone: 'positive', matchesHypothesis: false, verbatim: "The bot did what it could and got me to the right person quickly. I didn't feel like my time was wasted." },
        ],
      },
      {
        text: 'Were you left guessing about what went wrong?',
        context: 'For failed resolutions, customers often blame communication. A Yes confirms the explanation gap.',
        dispositions: [
          { label: 'I had no idea what happened', tone: 'negative', matchesHypothesis: true,  verbatim: "Nobody explained why there was a billing error in the first place. I still don't really know what went wrong on their end." },
          { label: 'It was clearly explained',   tone: 'positive', matchesHypothesis: false, verbatim: "Rachel walked me through exactly what happened and why. I left the call understanding the full situation." },
        ],
      }
    ],
    why: 'Unexpected charges can damage trust even when resolved - understanding the emotional impact helps improve proactive error prevention'
  },
  3: {
    title: '3 STARS: CALL TRANSFER IMPACT',
    topic: 'Call Transfer Impact',
    questions: [
      {
        text: 'Did that handoff from the bot cause any frustration?',
        context: 'The forced bot-to-human transfer due to CRM update caused sentiment drop from Positive (A) to Neutral (B). A Yes validates the friction point.',
        dispositions: [
          { label: 'It frustrated me', tone: 'negative', matchesHypothesis: true,  verbatim: "I had to repeat everything I'd already told the bot. By the time Rachel picked up I was already irritated." },
          { label: 'It was smooth',   tone: 'positive', matchesHypothesis: false, verbatim: "The transfer was actually smooth. Rachel already knew my issue and we got straight to it." },
        ],
      },
      {
        text: 'Did you have to repeat yourself when Rachel took over?',
        context: 'Repetition on transfer is what turns a "B" interaction into a "C". A Yes isolates the context-passing failure.',
        dispositions: [
          { label: 'I had to repeat myself',     tone: 'negative', matchesHypothesis: true,  verbatim: "I had to go through the whole thing again from the beginning. It's exhausting when the agent has no idea what you've already explained." },
          { label: 'She already knew my issue', tone: 'positive', matchesHypothesis: false, verbatim: "Rachel already had the full context from the bot. I didn't have to repeat anything which made the whole thing much easier." },
        ],
      }
    ],
    why: 'This question dynamically triggers because the system detected a sentiment shift from Positive (A) to Neutral (B) during the bot-to-human transfer, combined with a neutral CSAT score. This aims to identify the exact friction point in the escalation path.'
  },
  4: {
    title: '4-5 STARS: UNEXPECTED BILLING CHARGE',
    topic: 'Refund Processing',
    questions: [
      {
        text: 'Did Rachel handle the billing issue to your satisfaction?',
        context: 'The billing discrepancy was the primary reason for contact. A Yes confirms Rachel\'s resolution drove the positive outcome.',
        dispositions: [
          { label: 'Not quite',           tone: 'negative', matchesHypothesis: false, verbatim: "She tried but I'm still not 100% sure the issue is fully resolved. I might have to call back to confirm." },
          { label: 'She handled it well', tone: 'positive', matchesHypothesis: true,  verbatim: "Rachel was great. She found the error, explained it clearly, and sorted it out on the spot. Exactly what I needed." },
        ],
      },
      {
        text: 'Did Rachel set clear expectations on the refund timeline upfront?',
        context: 'Proactive expectation-setting is one of the top replicable behaviours in 4–5★ calls. A Yes isolates it as the replicable win.',
        dispositions: [
          { label: "I wasn't sure what to expect", tone: 'negative', matchesHypothesis: false, verbatim: "She mentioned a refund but wasn't specific about when. I'm still not sure if it's 3 days or 3 weeks." },
          { label: 'She was upfront about it',     tone: 'positive', matchesHypothesis: true,  verbatim: "Rachel told me upfront — 3 to 5 business days and I'd get a confirmation email. That kind of clarity makes a real difference." },
        ],
      }
    ],
    why: 'The agent\'s handling of the refund processing was the core of the positive experience - understanding how this impacted customer trust is crucial'
  },
  5: {
    title: '4-5 STARS: UNEXPECTED BILLING CHARGE',
    topic: 'Refund Processing',
    questions: [
      {
        text: 'Did Rachel handle the billing issue to your satisfaction?',
        context: 'The billing discrepancy was the primary reason for contact. A Yes confirms Rachel\'s resolution drove the positive outcome.',
        dispositions: [
          { label: 'Not quite',           tone: 'negative', matchesHypothesis: false, verbatim: "She tried but I'm still not 100% sure the issue is fully resolved. I might have to call back to confirm." },
          { label: 'She handled it well', tone: 'positive', matchesHypothesis: true,  verbatim: "Rachel was great. She found the error, explained it clearly, and sorted it out on the spot. Exactly what I needed." },
        ],
      },
      {
        text: 'Did Rachel set clear expectations on the refund timeline upfront?',
        context: 'Proactive expectation-setting is one of the top replicable behaviours in 4–5★ calls. A Yes isolates it as the replicable win.',
        dispositions: [
          { label: "I wasn't sure what to expect", tone: 'negative', matchesHypothesis: false, verbatim: "She mentioned a refund but wasn't specific about when. I'm still not sure if it's 3 days or 3 weeks." },
          { label: 'She was upfront about it',     tone: 'positive', matchesHypothesis: true,  verbatim: "Rachel told me upfront — 3 to 5 business days and I'd get a confirmation email. That kind of clarity makes a real difference." },
        ],
      }
    ],
    why: 'The agent\'s handling of the refund processing was the core of the positive experience - understanding how this impacted customer trust is crucial'
  }
};

/**
 * Reveals `text` one word at a time at `msPerWord` cadence (default 15ms).
 * Used inside the inline verbatim block once a disposition is picked.
 */
function WordTypewriter({ text, msPerWord = 15 }) {
  const [revealed, setRevealed] = useState(0)
  const words = text ? text.split(/\s+/) : []
  useEffect(() => {
    setRevealed(0)
    if (!text) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setRevealed(i)
      if (i >= words.length) clearInterval(id)
    }, msPerWord)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, msPerWord])
  return <span>{words.slice(0, revealed).join(' ')}</span>
}

export default function FeedbackIntelligenceDemo({ onBackToLanding }) {
  const [cur, setCur] = useState(5);
  const [phoneScreen, setPhoneScreen] = useState(1);
  const [selectedRating, setSelectedRating] = useState(null);
  const [surveyStep, setSurveyStep] = useState('listening'); // 'listening', 'thankyou', 'question', 'preview', 'voicewave', 'askquestion', 'answered'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({}); // Track answers: {0: 'yes', 1: 'no'}
  const [justAnswered, setJustAnswered] = useState(null); // Track the answer just given
  const [cardVisible, setCardVisible] = useState({}); // Track which stage cards are visible

  const [msgStates, setMsgStates] = useState({
    'cm1-1': 'msg-hidden',
    'cm1-2': 'msg-hidden',
    'cm1-3': 'msg-hidden',
    'cm1-4': 'msg-hidden',
    'cm2-1': 'msg-hidden',
    'cm2-2': 'msg-hidden',
    'cm2-3': 'msg-hidden',
    'cm2-4': 'msg-hidden',
    'cm3-1': 'msg-hidden',
    'cm3-2': 'msg-hidden',
    'cm3-3': 'msg-hidden'
  });
  const [typingActive, setTypingActive] = useState({});
  const [btnLabels, setBtnLabels] = useState({});
  const [btnDisabled, setBtnDisabled] = useState({});
  const timeoutsRef = useRef([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    return () => clearTimeouts();
  }, []);

  // Auto-play animation when entering Moment 1
  useEffect(() => {
    if (cur === 1) {
      setTimeout(() => playChat1(), 300);
    }
  }, [cur]);

  const goPhone = useCallback((n) => {
    if (n === 'done') {
      setPhoneScreen('done');
    } else if (n === 2) {
      // Start survey with voice animation sequence
      setPhoneScreen(2);
      setSurveyStep('listening');
      setTimeout(() => setSurveyStep('thankyou'), 2000);
      setTimeout(() => setSurveyStep('question'), 4000);
    } else if (n === 1) {
      // Reset to ready screen — clear ALL survey state so a restart is a clean slate
      setPhoneScreen(1);
      setSurveyStep('listening');
      setSelectedRating(null);
      setCurrentQuestion(0);
      setAnswers({});
      setJustAnswered(null);
    } else {
      setPhoneScreen(n);
    }
  }, []);

  const pickRating = useCallback((r) => {
    setSelectedRating(r);
    setSurveyStep('preview');
    setCurrentQuestion(0);
  }, []);

  const animateChat = useCallback((stageNum, msgCount, delays) => {
    clearTimeouts();
    const newMsgStates = {};
    for (let i = 1; i <= msgCount; i++) newMsgStates[`cm${stageNum}-${i}`] = 'msg-hidden';
    setMsgStates(prev => ({...prev, ...newMsgStates}));
    setTypingActive(prev => ({...prev, [stageNum]: false}));
    setBtnDisabled(prev => ({...prev, [stageNum]: true}));
    setBtnLabels(prev => ({...prev, [stageNum]: 'playing'}));
    setCardVisible(prev => ({...prev, [stageNum]: false})); // Hide card when animation starts

    delays.forEach((d, i) => {
      if (i < msgCount) {
        const typingTimeout = setTimeout(() => {
          setTypingActive(prev => ({...prev, [stageNum]: true}));
        }, Math.max(0, d - 700));
        timeoutsRef.current.push(typingTimeout);

        const msgTimeout = setTimeout(() => {
          setTypingActive(prev => ({...prev, [stageNum]: false}));
          setMsgStates(prev => ({...prev, [`cm${stageNum}-${i+1}`]: 'msg-visible'}));

          // Show card after 2nd message appears (during conversation)
          if (i === 1) {
            const cardTimeout = setTimeout(() => {
              setCardVisible(prev => ({...prev, [stageNum]: true}));
            }, 600);
            timeoutsRef.current.push(cardTimeout);
          }

          if (i === msgCount - 1) {
            setBtnDisabled(prev => ({...prev, [stageNum]: false}));
            setBtnLabels(prev => ({...prev, [stageNum]: '↺ Replay'}));
          }
        }, d);
        timeoutsRef.current.push(msgTimeout);
      }
    });
  }, []);

  const playChat1 = useCallback(() => animateChat(1, 4, [400, 1600, 2800, 4400]), [animateChat]);
  const playChat2 = useCallback(() => animateChat(2, 4, [400, 1600, 2800, 4200]), [animateChat]);
  const playChat3 = useCallback(() => animateChat(3, 3, [400, 1800, 3200]), [animateChat]);

  const goTo = useCallback((n) => {
    if (n === 0) { onBackToLanding(); return; }
    setCur(n);
    window.scrollTo(0, 0);
    if (n === 5) setPhoneScreen(1);

    // Hide all messages first, then auto-play animations when entering moments
    if (n === 1) {
      // Hide all messages for stage 1
      setMsgStates(prev => ({
        ...prev,
        'cm1-1': 'msg-hidden',
        'cm1-2': 'msg-hidden',
        'cm1-3': 'msg-hidden',
        'cm1-4': 'msg-hidden'
      }));
      setTimeout(() => playChat1(), 300);
    } else if (n === 2) {
      // Hide all messages for stage 2
      setMsgStates(prev => ({
        ...prev,
        'cm2-1': 'msg-hidden',
        'cm2-2': 'msg-hidden',
        'cm2-3': 'msg-hidden',
        'cm2-4': 'msg-hidden'
      }));
      setTimeout(() => playChat2(), 300);
    } else if (n === 3) {
      // Hide all messages for stage 3
      setMsgStates(prev => ({
        ...prev,
        'cm3-1': 'msg-hidden',
        'cm3-2': 'msg-hidden',
        'cm3-3': 'msg-hidden'
      }));
      setTimeout(() => playChat3(), 300);
    }
  }, [onBackToLanding, playChat1, playChat2, playChat3]);

  const getMsgClass = (id) => {
    const state = msgStates[id];
    if (state === 'msg-hidden') return 'msg-animated msg-hidden';
    if (state === 'msg-visible') return 'msg-animated msg-visible';
    return 'msg-animated';
  };

  const renderPlayBtn = (stageNum, onPlay) => {
    const label = btnLabels[stageNum];
    const disabled = btnDisabled[stageNum];
    if (label === 'playing') {
      return (
        <button className="chat-play-btn" disabled={true}>
          <span className="btn-voice-wave"><span className="btn-vb"></span><span className="btn-vb"></span><span className="btn-vb"></span><span className="btn-vb"></span><span className="btn-vb"></span></span>
          Playing
        </button>
      );
    }
    return (
      <button className="chat-play-btn" onClick={onPlay} disabled={disabled}>
        {label === '↺ Replay' ? '↺ Replay' : '▶ Play call'}
      </button>
    );
  };

  const progressWidth = (stageToPill[cur] / (STAGES - 1) * 100) + '%';

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: CSS_TEXT}} />

      <div className="progress-bar"><div className="progress-fill" style={{width: progressWidth}}></div></div>

      <nav className="top-nav">
        <div className="nav-logo">
          <svg width="20" height="20" viewBox="0 0 24 23.848" fill="none" style={{color:'#3694fc'}}>
            <path d="M 23.719 5.814 C 23.876 5.815 24.002 5.94 24 6.096 C 23.849 15.818 15.918 23.698 6.134 23.848 C 5.978 23.849 5.851 23.724 5.851 23.568 L 5.851 19.309 C 5.851 19.156 5.975 19.034 6.129 19.03 C 13.245 18.884 19.005 13.16 19.152 6.09 C 19.156 5.936 19.279 5.813 19.433 5.813 L 23.719 5.814 Z" fill="currentColor" fillRule="nonzero"/>
            <path d="M 12.256 0.001 C 13.871 0.001 15.18 1.302 15.181 2.906 C 15.181 4.511 13.872 5.812 12.256 5.813 C 10.64 5.813 9.33 4.511 9.33 2.906 C 9.33 1.302 10.64 0.001 12.256 0.001 Z" fill="currentColor" fillRule="nonzero"/>
            <path d="M 2.926 0 C 4.541 0 5.85 1.301 5.851 2.905 C 5.851 4.509 4.541 5.811 2.926 5.812 C 1.31 5.812 0 4.51 0 2.905 C 0 1.301 1.31 0 2.926 0 Z" fill="currentColor" fillRule="nonzero"/>
          </svg>
          Feedback Intelligence
        </div>
        <div className="nav-breadcrumb">
          <span>Feedback Intelligence</span>
        </div>
        <div className="nav-spacer"></div>
        <div className="nav-stage-pills">
          {stageLabels.map((l, i) => (
            <button key={i} className={'nav-pill' + (pillToStage[i] === cur ? ' active' : '')} onClick={() => goTo(pillToStage[i])}>{l}</button>
          ))}
        </div>
      </nav>

      {/* STAGE 0 — INTRO: AGENT FLOW STRUCTURE */}
      <section className={'stage' + (cur === 0 ? ' active' : '')} id="stage-0">
        <div className="page-header">
          <div>
            <div className="act-label act2">Introduction</div>
            <div className="page-title">Feedback Intelligence Agent Flow</div>
            <div className="page-subtitle">AI-powered survey orchestration from interaction to insight</div>
          </div>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            <button className="btn btn-primary" onClick={() => goTo(5)}>Start demo →</button>
          </div>
        </div>

        <div className="flow-structure-grid">
          {/* Step 1: Interaction */}
          <div className="flow-step flow-step-blue">
            <div className="flow-step-header">
              <div className="flow-step-number">1</div>
              <div className="flow-step-title">Live Interaction</div>
            </div>
            <div className="flow-step-subtitle">Voice/Chat transcript analyzed in real-time</div>
            <div className="flow-step-items">
              <div className="flow-step-item">• Sentiment tracking</div>
              <div className="flow-step-item">• Intent detection</div>
              <div className="flow-step-item">• VU scoring</div>
            </div>
          </div>

          <div className="flow-arrow">→</div>

          {/* Step 2: Detection */}
          <div className="flow-step flow-step-green">
            <div className="flow-step-header">
              <div className="flow-step-number">2</div>
              <div className="flow-step-title">Topic Detection</div>
            </div>
            <div className="flow-step-subtitle">AI identifies key moments & friction</div>
            <div className="flow-step-items">
              <div className="flow-step-item">• Billing Error</div>
              <div className="flow-step-item">• Transfer Impact</div>
              <div className="flow-step-item">• Refund Process</div>
            </div>
          </div>

          <div className="flow-arrow">→</div>

          {/* Step 3: Question Bank */}
          <div className="flow-step flow-step-amber">
            <div className="flow-step-header">
              <div className="flow-step-number">3</div>
              <div className="flow-step-title">Question Generation</div>
            </div>
            <div className="flow-step-subtitle">Contextual questions pre-loaded</div>
            <div className="flow-step-items">
              <div className="flow-step-item">• 1-2★ questions</div>
              <div className="flow-step-item">• 3★ questions</div>
              <div className="flow-step-item">• 4-5★ questions</div>
            </div>
          </div>

          <div className="flow-arrow">→</div>

          {/* Step 4: Survey */}
          <div className="flow-step flow-step-purple">
            <div className="flow-step-header">
              <div className="flow-step-number">4</div>
              <div className="flow-step-title">Voice AI Survey</div>
            </div>
            <div className="flow-step-subtitle">Dynamic question routing by rating</div>
            <div className="flow-step-items">
              <div className="flow-step-item">• Rating capture</div>
              <div className="flow-step-item">• Contextual drill-down</div>
              <div className="flow-step-item">• Real-time validation</div>
            </div>
          </div>
        </div>

        <div style={{textAlign:'center',marginTop:'32px'}}>
          <p style={{fontSize:'14px',color:'var(--fg-secondary)',marginBottom:'16px'}}>This demo walks through all four stages of the agent flow</p>
          <button className="btn btn-primary btn-lg" onClick={() => goTo(5)}>Start with Survey →</button>
        </div>
      </section>

      {/* STAGE 1 — MOMENT 1: BILLING ERROR */}
      <section className={'stage' + (cur === 1 ? ' active' : '')} id="stage-1">
        <div className="page-header">
          <div>
            <div className="act-label act1">Act 1 · Moment 1 of 3</div>
            <div className="page-title">James calls about a charge he didn't recognize</div>
            <div className="page-subtitle">Andrew (AI agent) picks up — INT-022</div>
          </div>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            <button className="btn btn-secondary" onClick={() => goTo(5)}>← Back</button>
            <button className="btn btn-primary" onClick={() => goTo(2)}>Next moment →</button>
          </div>
        </div>

        <div className="convo-grid">
          <div className="chat-card">
            <div className="chat-top-bar">
              <div className="avatar av-ai">A</div>
              <div className="chat-top-info">
                <div className="chat-top-title">Inbound Voice Call</div>
                <div className="chat-top-sub">INT-022 · Andrew (AI) → Rachel Whitman</div>
              </div>
              <div className="live-indicator"><div className="live-dot"></div> Live</div>
              {renderPlayBtn(1, playChat1)}
            </div>
            <div className="chat-body">
              <div className={getMsgClass('cm1-1')}>
                <div className="msg">
                  <div className="avatar av-ai">A</div>
                  <div className="msg-wrap">
                    <div className="msg-sender"><span className="role-tag role-ai">AI</span> Andrew</div>
                    <div className="bubble">Thank you for calling. My name is Andrew, your virtual assistant. How can I help you today?</div>
                    <div className="msg-ts">00:00</div>
                  </div>
                </div>
              </div>
              <div className={getMsgClass('cm1-2')}>
                <div className="msg msg-customer">
                  <div className="avatar av-customer">JC</div>
                  <div className="msg-wrap">
                    <div className="msg-sender">James Carter</div>
                    <div className="bubble">Yeah, hi. I just got my bill and there's a charge on there I don't recognize. It's like eighty-seven dollars and I have no idea what it's for.</div>
                    <div className="msg-ts">00:06</div>
                  </div>
                </div>
              </div>
              <div className={getMsgClass('cm1-3')}>
                <div className="msg">
                  <div className="avatar av-ai">A</div>
                  <div className="msg-wrap">
                    <div className="msg-sender"><span className="role-tag role-ai">AI</span> Andrew</div>
                    <div className="bubble">I'm sorry to hear about the unexpected charge, James. I'd be happy to look into that for you. Could you confirm the email address associated with your account?</div>
                    <div className="msg-ts">00:14</div>
                  </div>
                </div>
              </div>
              <div className={getMsgClass('cm1-4')}>
                <div className="msg msg-customer">
                  <div className="avatar av-customer">JC</div>
                  <div className="msg-wrap">
                    <div className="msg-sender">James Carter</div>
                    <div className="bubble">Premium add-on? I didn't add anything to my plan. <span className="bubble-highlight">I've had the same basic plan for two years. This has to be a mistake.</span></div>
                    <div className="msg-ts">00:55 · 📍 Billing Error detected</div>
                  </div>
                </div>
              </div>
              <div className={'typing-indicator' + (typingActive[1] ? ' ti-active' : '')}>
                <div className="avatar av-ai" style={{opacity:0.5}}>A</div>
                <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
                  <div className="voice-wave"><div className="voice-bar"></div><div className="voice-bar"></div><div className="voice-bar"></div><div className="voice-bar"></div><div className="voice-bar"></div><div className="voice-bar"></div><div className="voice-bar"></div></div>
                  <div className="typing-label">Andrew speaking…</div>
                </div>
              </div>
            </div>
            <div className="sentiment-strip">
              <div className="sentiment-label-row">
                <span>Sentiment track</span>
                <span style={{color:'var(--status-success-strong)',fontWeight:600}}>● Positive</span>
              </div>
              <div className="sentiment-track">
                <div className="sentiment-fill" style={{width:'82%',background:'var(--status-success-strong)'}}></div>
              </div>
            </div>
          </div>

          <div className="detection-col" style={{opacity: cardVisible[1] ? 1 : 0, transform: cardVisible[1] ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease'}}>
            <div className="det-card">
              <div className="ai-panel-header" style={{background:'var(--ai-purple-subtle)',borderBottomColor:'var(--ai-purple-border)'}}>
                <span className="ai-panel-topic" style={{color:'var(--ai-purple)',display:'flex',alignItems:'center',gap:'4px'}}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#paint0_angular_17907_139120_clip_path)" data-figma-skip-parse="true"><g transform="matrix(-0.012125 0.0135 -0.0135 -0.012125 16.5 6.5)"><foreignObject x="-1254.5" y="-1254.5" width="2508.99" height="2508.99"><div xmlns="http://www.w3.org/1999/xhtml" style={{background:'conic-gradient(from 90deg,rgba(95, 133, 255, 1) 0deg,rgba(80, 182, 255, 1) 70.9615deg,rgba(118, 64, 255, 1) 257.885deg,rgba(95, 133, 255, 1) 360deg)',height:'100%',width:'100%',opacity:1}}></div></foreignObject></g></g>
                    <path d="M4.78081 11.6774L7.92487 10.1055C8.86833 9.63382 9.63326 8.86874 10.105 7.92531L11.6776 4.78078C11.7808 4.5745 11.9918 4.4441 12.2226 4.4441C12.4532 4.4441 12.6644 4.5745 12.7676 4.78078L14.3397 7.92474C14.8112 8.86817 15.5763 9.63307 16.5196 10.1048L19.6631 11.6773C19.8696 11.7804 20 11.9915 20 12.2223C20 12.4532 19.8696 12.6641 19.6631 12.7673L16.5191 14.3393C15.5757 14.8109 14.8107 15.5759 14.3391 16.5192L12.7671 19.6631C12.6638 19.8696 12.4527 20 12.2221 20C11.9912 20 11.7803 19.8696 11.677 19.6631L10.105 16.5192C9.63325 15.5759 8.86833 14.8108 7.92487 14.3393L4.78081 12.7668C4.5747 12.6634 4.44449 12.4526 4.44449 12.222C4.44449 11.9913 4.5747 11.7806 4.78081 11.6774ZM5.17442 4.24068L6.52175 3.56601C6.61011 3.52174 6.66573 3.43153 6.66573 3.33276C6.66573 3.23399 6.61011 3.14377 6.52175 3.0995L5.17442 2.42559C4.77002 2.2234 4.44226 1.89564 4.24006 1.49126L3.56613 0.143972C3.52186 0.0556143 3.43164 0 3.33286 0C3.23409 0 3.14387 0.0556191 3.0996 0.143972L2.42567 1.49126C2.22347 1.89565 1.8957 2.2234 1.49131 2.42559L0.143976 3.0995C0.0556158 3.14377 0 3.23399 0 3.33276C0 3.43153 0.0556205 3.52175 0.143976 3.56601L1.4915 4.23973C1.8959 4.44174 2.22367 4.76987 2.42568 5.17406L3.0996 6.52154C3.14388 6.60989 3.23409 6.66551 3.33287 6.66551C3.43164 6.66551 3.52187 6.60989 3.56613 6.52154L4.23987 5.17406C4.44207 4.76967 4.77003 4.44268 5.17442 4.24068Z" fill="url(#sparkle_gradient)"/>
                    <defs>
                      <linearGradient id="sparkle_gradient" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                        <stop offset="0.197" stopColor="rgb(80, 182, 255)"/>
                        <stop offset="0.716" stopColor="rgb(118, 64, 255)"/>
                      </linearGradient>
                      <clipPath id="paint0_angular_17907_139120_clip_path"><path d="M4.78081 11.6774L7.92487 10.1055C8.86833 9.63382 9.63326 8.86874 10.105 7.92531L11.6776 4.78078C11.7808 4.5745 11.9918 4.4441 12.2226 4.4441C12.4532 4.4441 12.6644 4.5745 12.7676 4.78078L14.3397 7.92474C14.8112 8.86817 15.5763 9.63307 16.5196 10.1048L19.6631 11.6773C19.8696 11.7804 20 11.9915 20 12.2223C20 12.4532 19.8696 12.6641 19.6631 12.7673L16.5191 14.3393C15.5757 14.8109 14.8107 15.5759 14.3391 16.5192L12.7671 19.6631C12.6638 19.8696 12.4527 20 12.2221 20C11.9912 20 11.7803 19.8696 11.677 19.6631L10.105 16.5192C9.63325 15.5759 8.86833 14.8108 7.92487 14.3393L4.78081 12.7668C4.5747 12.6634 4.44449 12.4526 4.44449 12.222C4.44449 11.9913 4.5747 11.7806 4.78081 11.6774ZM5.17442 4.24068L6.52175 3.56601C6.61011 3.52174 6.66573 3.43153 6.66573 3.33276C6.66573 3.23399 6.61011 3.14377 6.52175 3.0995L5.17442 2.42559C4.77002 2.2234 4.44226 1.89564 4.24006 1.49126L3.56613 0.143972C3.52186 0.0556143 3.43164 0 3.33286 0C3.23409 0 3.14387 0.0556191 3.0996 0.143972L2.42567 1.49126C2.22347 1.89565 1.8957 2.2234 1.49131 2.42559L0.143976 3.0995C0.0556158 3.14377 0 3.23399 0 3.33276C0 3.43153 0.0556205 3.52175 0.143976 3.56601L1.4915 4.23973C1.8959 4.44174 2.22367 4.76987 2.42568 5.17406L3.0996 6.52154C3.14388 6.60989 3.23409 6.66551 3.33287 6.66551C3.43164 6.66551 3.52187 6.60989 3.56613 6.52154L4.23987 5.17406C4.44207 4.76967 4.77003 4.44268 5.17442 4.24068Z"/></clipPath>
                    </defs>
                  </svg>
                  Billing Error
                </span>
                <div className="grade grade-a" style={{fontSize:'11px'}}>A · Positive</div>
                <div className="ai-processing"><div className="ai-dot"></div><div className="ai-dot"></div><div className="ai-dot"></div></div>
              </div>
              <div className="det-card-body" style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                <div>
                  <div style={{fontSize:'12px',fontWeight:600,color:'var(--fg-default)'}}>Unexpected charge keyword</div>
                  <div style={{fontSize:'11px',color:'var(--fg-secondary)',marginTop:'2px',lineHeight:1.4}}>"Charge I don't recognize" — billing anomaly classifier triggered at 00:06</div>
                </div>
                <div style={{height:'1px',background:'var(--border-subtle)'}}></div>
                <div>
                  <div style={{fontSize:'12px',fontWeight:600,color:'var(--fg-default)'}}>Denial of account change</div>
                  <div style={{fontSize:'11px',color:'var(--fg-secondary)',marginTop:'2px',lineHeight:1.4}}>"I didn't add anything" — disputed charge signal, high billing error confidence</div>
                </div>
                <div style={{height:'1px',background:'var(--border-subtle)'}}></div>
                <div>
                  <div style={{fontSize:'12px',fontWeight:600,color:'var(--ai-purple)',display:'flex',alignItems:'center',gap:'6px'}}>
                    <span style={{display:'inline-flex',gap:'2px',alignItems:'center'}}>
                      <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'var(--ai-purple)',display:'inline-block',animation:'aiPulse 1.2s infinite'}}></span>
                      <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'var(--ai-purple)',display:'inline-block',animation:'aiPulse 1.2s 0.2s infinite'}}></span>
                      <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'var(--ai-purple)',display:'inline-block',animation:'aiPulse 1.2s 0.4s infinite'}}></span>
                    </span>
                    AI generating questions…
                  </div>
                  <div style={{fontSize:'11px',color:'var(--fg-secondary)',marginTop:'2px',lineHeight:1.4}}>Tiered for 1–2★, 3★, and 4–5★ in parallel. Ready before call ends.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE 2 — MOMENT 2: TRANSFER FRICTION */}
      <section className={'stage' + (cur === 2 ? ' active' : '')} id="stage-2">
        <div className="page-header">
          <div>
            <div className="act-label act2">Act 1 · Moment 2 of 3 · ⚠ Friction detected</div>
            <div className="page-title">Andrew announces the transfer — James pushes back</div>
            <div className="page-subtitle">Policy change forces a bot-to-human handoff. Sentiment shifts at 01:16.</div>
          </div>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            <button className="btn btn-secondary" onClick={() => goTo(1)}>← Back</button>
            <button className="btn btn-primary" onClick={() => goTo(3)}>Next moment →</button>
          </div>
        </div>

        <div className="convo-grid">
          <div className="chat-card">
            <div className="chat-top-bar">
              <div className="avatar av-ai">A</div>
              <div className="chat-top-info">
                <div className="chat-top-title">Pinnacle Communications — Voice</div>
                <div className="chat-top-sub">INT-022 · 01:04 — Transfer moment</div>
              </div>
              <div className="live-indicator"><div className="live-dot"></div> Live</div>
              {renderPlayBtn(2, playChat2)}
            </div>
            <div className="chat-body">
              <div className={getMsgClass('cm2-1')}>
                <div className="msg">
                  <div className="avatar av-ai">A</div>
                  <div className="msg-wrap">
                    <div className="msg-sender"><span className="role-tag role-ai">AI</span> Andrew</div>
                    <div className="bubble">However, due to a major CRM system update that rolled out on March 18th, all billing inquiries are temporarily being routed to our live billing specialists to ensure accuracy.</div>
                    <div className="msg-ts">01:04</div>
                  </div>
                </div>
              </div>
              <div className={getMsgClass('cm2-2')}>
                <div className="msg msg-customer">
                  <div className="avatar av-customer">JC</div>
                  <div className="msg-wrap">
                    <div className="msg-sender">James Carter</div>
                    <div className="bubble bubble-friction"><span className="bubble-highlight">Wait, so after all those questions, you still need to transfer me?</span></div>
                    <div className="msg-ts">01:16 · 📍 Call Transfer Impact detected</div>
                    <div className="inline-detection-pill">
                      <span className="idp-topic">Call Transfer Impact</span>
                      <span className="idp-shift"><span className="idp-from">Positive</span> → <span className="idp-to">Neutral</span></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={getMsgClass('cm2-3')}>
                <div className="msg">
                  <div className="avatar av-ai">A</div>
                  <div className="msg-wrap">
                    <div className="msg-sender"><span className="role-tag role-ai">AI</span> Andrew</div>
                    <div className="bubble">Yes. I sincerely apologize for the extra step, but I will transfer you to a human billing specialist who has full access to the new system. I'll pass along all the details so you won't need to repeat yourself.</div>
                    <div className="msg-ts">01:20</div>
                  </div>
                </div>
              </div>
              <div className={getMsgClass('cm2-4')}>
                <div className="transfer-banner">
                  <div className="transfer-icon">⇄</div>
                  <div>
                    <div style={{fontWeight:600}}>Transferred to Rachel Whitman (Billing Specialist)</div>
                    <div style={{fontSize:'11px',opacity:0.7,marginTop:'1px'}}>Context passed · Est. wait &lt;2 min</div>
                  </div>
                </div>
              </div>
              <div className={'typing-indicator' + (typingActive[2] ? ' ti-active' : '')}>
                <div className="avatar av-ai" style={{opacity:0.5}}>A</div>
                <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
                  <div className="voice-wave"><div className="voice-bar"></div><div className="voice-bar"></div><div className="voice-bar"></div><div className="voice-bar"></div><div className="voice-bar"></div><div className="voice-bar"></div><div className="voice-bar"></div></div>
                  <div className="typing-label">Andrew speaking…</div>
                </div>
              </div>
            </div>
            <div className="sentiment-strip">
              <div className="sentiment-label-row">
                <span>Sentiment track</span>
                <span style={{color:'var(--status-warning-moderate)',fontWeight:600}}>● Shifting → Neutral</span>
              </div>
              <div className="sentiment-track">
                <div className="sentiment-fill" style={{width:'46%',background:'var(--status-warning-moderate)'}}></div>
              </div>
            </div>
          </div>

          <div className="detection-col" style={{opacity: cardVisible[2] ? 1 : 0, transform: cardVisible[2] ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease'}}>
            <div className="det-card">
              <div className="ai-panel-header" style={{background:'var(--ai-purple-subtle)',borderBottomColor:'var(--ai-purple-border)'}}>
                <span className="ai-panel-topic" style={{color:'var(--ai-purple)'}}>Call Transfer Impact</span>
                <div className="inline-detection-pill" style={{padding:'2px 8px',margin:0,background:'var(--status-warning-subtle)',borderColor:'rgba(217,119,6,0.2)'}}><span className="idp-from">Positive</span><span style={{color:'var(--fg-tertiary)'}}> → </span><span className="idp-to">Neutral</span></div>
              </div>
              <div className="det-card-body" style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                <div>
                  <div style={{fontSize:'12px',fontWeight:600,color:'var(--fg-default)'}}>Friction phrase at 01:16</div>
                  <div style={{fontSize:'11px',color:'var(--fg-secondary)',marginTop:'2px',lineHeight:1.4}}>"After all those questions" — wasted effort pattern, friction classifier triggered</div>
                </div>
                <div style={{height:'1px',background:'var(--border-subtle)'}}></div>
                <div>
                  <div style={{fontSize:'12px',fontWeight:600,color:'var(--fg-default)'}}>Sentiment dropped sharply</div>
                  <div style={{fontSize:'11px',color:'var(--fg-secondary)',marginTop:'2px',lineHeight:1.4}}>Positive → Neutral in one utterance · root cause: CRM policy update, not Rachel</div>
                </div>
                <div style={{height:'1px',background:'var(--border-subtle)'}}></div>
                <div>
                  <div style={{fontSize:'12px',fontWeight:600,color:'var(--ai-purple)'}}>Classified: SYSTEM_PROCESS</div>
                  <div style={{fontSize:'11px',color:'var(--fg-secondary)',marginTop:'2px',lineHeight:1.4}}>Agent protected · ticket routed to Operations, not QM coaching queue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE 3 — MOMENT 3: RESOLUTION */}
      <section className={'stage' + (cur === 3 ? ' active' : '')} id="stage-3">
        <div className="page-header">
          <div>
            <div className="act-label act1">Act 1 · Moment 3 of 3 · Resolution</div>
            <div className="page-title">Rachel resolves it cleanly — but the rating will be 3★</div>
            <div className="page-subtitle">Refund promised, account protected, James grateful. Friction already captured upstream.</div>
          </div>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            <button className="btn btn-secondary" onClick={() => goTo(2)}>← Back</button>
            <button className="btn btn-primary" onClick={() => goTo(4)}>Under the hood →</button>
          </div>
        </div>

        <div className="convo-grid">
          <div className="chat-card">
            <div className="chat-top-bar">
              <div className="avatar av-human">R</div>
              <div className="chat-top-info">
                <div className="chat-top-title">Rachel Whitman — Billing Specialist</div>
                <div className="chat-top-sub">INT-022 · Human segment · Resolution</div>
              </div>
              <div className="live-indicator human-indicator"><div className="live-dot human-dot"></div> Human</div>
              {renderPlayBtn(3, playChat3)}
            </div>
            <div className="chat-body">
              <div className={getMsgClass('cm3-1')}>
                <div className="msg">
                  <div className="avatar av-human">R</div>
                  <div className="msg-wrap">
                    <div className="msg-sender"><span className="role-tag role-human">Human</span> Rachel Whitman</div>
                    <div className="bubble">I'm submitting a full refund of the $87.00 to your original payment method. You should see that back on your statement within five to seven business days. I'm also permanently removing that bundle from your account.</div>
                    <div className="msg-ts">01:14</div>
                  </div>
                </div>
              </div>
              <div className={getMsgClass('cm3-2')}>
                <div className="msg msg-customer">
                  <div className="avatar av-customer">JC</div>
                  <div className="msg-wrap">
                    <div className="msg-sender">James Carter</div>
                    <div className="bubble">Yes, that's perfect. Thank you so much, Rachel. That's exactly what I needed.</div>
                    <div className="msg-ts">01:34</div>
                  </div>
                </div>
              </div>
              <div className={getMsgClass('cm3-3')}>
                <div className="msg msg-customer">
                  <div className="avatar av-customer">JC</div>
                  <div className="msg-wrap">
                    <div className="msg-sender">James Carter</div>
                    <div className="bubble"><span className="bubble-highlight">Honestly, that's way faster than I expected. Thank you so much.</span> Rachel, you've been fantastic.</div>
                    <div className="msg-ts">03:12 · 📍 Refund Processing detected</div>
                  </div>
                </div>
              </div>
              <div className={'typing-indicator' + (typingActive[3] ? ' ti-active' : '')}>
                <div className="avatar av-human" style={{opacity:0.5}}>R</div>
                <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
                  <div className="voice-wave"><div className="voice-bar" style={{background:'#0ea5e9'}}></div><div className="voice-bar" style={{background:'#0ea5e9'}}></div><div className="voice-bar" style={{background:'#0ea5e9'}}></div><div className="voice-bar" style={{background:'#0ea5e9'}}></div><div className="voice-bar" style={{background:'#0ea5e9'}}></div><div className="voice-bar" style={{background:'#0ea5e9'}}></div><div className="voice-bar" style={{background:'#0ea5e9'}}></div></div>
                  <div className="typing-label">Rachel speaking…</div>
                </div>
              </div>
            </div>
            <div className="sentiment-strip">
              <div className="sentiment-label-row">
                <span>Final sentiment</span>
                <span style={{color:'var(--status-warning-moderate)',fontWeight:600}}>● Neutral · 3★ expected</span>
              </div>
              <div className="sentiment-track">
                <div className="sentiment-fill" style={{width:'54%',background:'var(--status-warning-moderate)'}}></div>
              </div>
            </div>
          </div>

          <div className="detection-col" style={{opacity: cardVisible[3] ? 1 : 0, transform: cardVisible[3] ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease'}}>
            <div className="det-card">
              <div className="ai-panel-header" style={{background:'var(--ai-purple-subtle)',borderBottomColor:'var(--ai-purple-border)'}}>
                <span className="ai-panel-topic" style={{color:'var(--ai-purple)',display:'flex',alignItems:'center',gap:'4px'}}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#paint0_angular_17907_139120_clip_path_2)" data-figma-skip-parse="true"><g transform="matrix(-0.012125 0.0135 -0.0135 -0.012125 16.5 6.5)"><foreignObject x="-1254.5" y="-1254.5" width="2508.99" height="2508.99"><div xmlns="http://www.w3.org/1999/xhtml" style={{background:'conic-gradient(from 90deg,rgba(95, 133, 255, 1) 0deg,rgba(80, 182, 255, 1) 70.9615deg,rgba(118, 64, 255, 1) 257.885deg,rgba(95, 133, 255, 1) 360deg)',height:'100%',width:'100%',opacity:1}}></div></foreignObject></g></g>
                    <path d="M4.78081 11.6774L7.92487 10.1055C8.86833 9.63382 9.63326 8.86874 10.105 7.92531L11.6776 4.78078C11.7808 4.5745 11.9918 4.4441 12.2226 4.4441C12.4532 4.4441 12.6644 4.5745 12.7676 4.78078L14.3397 7.92474C14.8112 8.86817 15.5763 9.63307 16.5196 10.1048L19.6631 11.6773C19.8696 11.7804 20 11.9915 20 12.2223C20 12.4532 19.8696 12.6641 19.6631 12.7673L16.5191 14.3393C15.5757 14.8109 14.8107 15.5759 14.3391 16.5192L12.7671 19.6631C12.6638 19.8696 12.4527 20 12.2221 20C11.9912 20 11.7803 19.8696 11.677 19.6631L10.105 16.5192C9.63325 15.5759 8.86833 14.8108 7.92487 14.3393L4.78081 12.7668C4.5747 12.6634 4.44449 12.4526 4.44449 12.222C4.44449 11.9913 4.5747 11.7806 4.78081 11.6774ZM5.17442 4.24068L6.52175 3.56601C6.61011 3.52174 6.66573 3.43153 6.66573 3.33276C6.66573 3.23399 6.61011 3.14377 6.52175 3.0995L5.17442 2.42559C4.77002 2.2234 4.44226 1.89564 4.24006 1.49126L3.56613 0.143972C3.52186 0.0556143 3.43164 0 3.33286 0C3.23409 0 3.14387 0.0556191 3.0996 0.143972L2.42567 1.49126C2.22347 1.89565 1.8957 2.2234 1.49131 2.42559L0.143976 3.0995C0.0556158 3.14377 0 3.23399 0 3.33276C0 3.43153 0.0556205 3.52175 0.143976 3.56601L1.4915 4.23973C1.8959 4.44174 2.22367 4.76987 2.42568 5.17406L3.0996 6.52154C3.14388 6.60989 3.23409 6.66551 3.33287 6.66551C3.43164 6.66551 3.52187 6.60989 3.56613 6.52154L4.23987 5.17406C4.44207 4.76967 4.77003 4.44268 5.17442 4.24068Z" fill="url(#sparkle_gradient_2)"/>
                    <defs>
                      <linearGradient id="sparkle_gradient_2" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                        <stop offset="0.197" stopColor="rgb(80, 182, 255)"/>
                        <stop offset="0.716" stopColor="rgb(118, 64, 255)"/>
                      </linearGradient>
                      <clipPath id="paint0_angular_17907_139120_clip_path_2"><path d="M4.78081 11.6774L7.92487 10.1055C8.86833 9.63382 9.63326 8.86874 10.105 7.92531L11.6776 4.78078C11.7808 4.5745 11.9918 4.4441 12.2226 4.4441C12.4532 4.4441 12.6644 4.5745 12.7676 4.78078L14.3397 7.92474C14.8112 8.86817 15.5763 9.63307 16.5196 10.1048L19.6631 11.6773C19.8696 11.7804 20 11.9915 20 12.2223C20 12.4532 19.8696 12.6641 19.6631 12.7673L16.5191 14.3393C15.5757 14.8109 14.8107 15.5759 14.3391 16.5192L12.7671 19.6631C12.6638 19.8696 12.4527 20 12.2221 20C11.9912 20 11.7803 19.8696 11.677 19.6631L10.105 16.5192C9.63325 15.5759 8.86833 14.8108 7.92487 14.3393L4.78081 12.7668C4.5747 12.6634 4.44449 12.4526 4.44449 12.222C4.44449 11.9913 4.5747 11.7806 4.78081 11.6774ZM5.17442 4.24068L6.52175 3.56601C6.61011 3.52174 6.66573 3.43153 6.66573 3.33276C6.66573 3.23399 6.61011 3.14377 6.52175 3.0995L5.17442 2.42559C4.77002 2.2234 4.44226 1.89564 4.24006 1.49126L3.56613 0.143972C3.52186 0.0556143 3.43164 0 3.33286 0C3.23409 0 3.14387 0.0556191 3.0996 0.143972L2.42567 1.49126C2.22347 1.89565 1.8957 2.2234 1.49131 2.42559L0.143976 3.0995C0.0556158 3.14377 0 3.23399 0 3.33276C0 3.43153 0.0556205 3.52175 0.143976 3.56601L1.4915 4.23973C1.8959 4.44174 2.22367 4.76987 2.42568 5.17406L3.0996 6.52154C3.14388 6.60989 3.23409 6.66551 3.33287 6.66551C3.43164 6.66551 3.52187 6.60989 3.56613 6.52154L4.23987 5.17406C4.44207 4.76967 4.77003 4.44268 5.17442 4.24068Z"/></clipPath>
                    </defs>
                  </svg>
                  Refund Processing
                </span>
                <div className="grade grade-a">A · Positive</div>
              </div>
              <div className="det-card-body" style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                <div>
                  <div style={{fontSize:'12px',fontWeight:600,color:'var(--fg-default)'}}>Emotional intensity spike</div>
                  <div style={{fontSize:'11px',color:'var(--fg-secondary)',marginTop:'2px',lineHeight:1.4}}>"Way faster than expected" — positive surprise language, high intensity score</div>
                </div>
                <div style={{height:'1px',background:'var(--border-subtle)'}}></div>
                <div>
                  <div style={{fontSize:'12px',fontWeight:600,color:'var(--fg-default)'}}>Refund confirmed in transcript</div>
                  <div style={{fontSize:'11px',color:'var(--fg-secondary)',marginTop:'2px',lineHeight:1.4}}>Rachel's $87.00 refund resolved James's primary complaint · topic closed positively</div>
                </div>
                <div style={{height:'1px',background:'var(--border-subtle)'}}></div>
                <div>
                  <div style={{fontSize:'12px',fontWeight:600,color:'var(--ai-purple)'}}>All 3 topics locked · Survey ready</div>
                  <div style={{fontSize:'11px',color:'var(--fg-secondary)',marginTop:'3px',lineHeight:1.4,display:'flex',gap:'4px',flexWrap:'wrap'}}>
                    <span className="badge badge-success" style={{fontSize:'10px'}}>Billing Error · 32</span>
                    <span className="badge badge-warning" style={{fontSize:'10px'}}>Transfer · 32</span>
                    <span className="badge badge-warning" style={{fontSize:'10px'}}>Refund · 36 ⚑</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE 4 — UNDER THE HOOD */}
      <section className={'stage' + (cur === 4 ? ' active' : '')} id="stage-4">
        <div className="page-header">
          <div>
            <div className="page-title">Three topics. Three VU scores. Six questions. One verdict.</div>
            <div className="page-subtitle">System pre-built the question bank before James picks up the phone to rate.</div>
          </div>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            <button className="btn btn-secondary" onClick={() => goTo(3)}>← Back</button>
            <button className="btn btn-secondary" onClick={() => goTo(0)}>Restart ↺</button>
          </div>
        </div>

        <div className="hood-grid">
          {/* Topic 1 */}
          <div className="hood-card">
            <div className="hood-card-top green"></div>
            <div className="hood-card-body">
              <div className="hood-topic-label">
                <div>
                  <div className="hood-topic-pills">
                    <span className="hood-pill">Topic 1</span>
                    <span className="hood-pill grade-a">A · Positive</span>
                  </div>
                  <div className="hood-topic-name hood-topic-highlight">Billing Error</div>
                </div>
              </div>
              <div className="hood-vu-display">
                <div className="hood-vu-num green">32</div>
                <div className="hood-vu-meta">
                  <div className="hood-vu-label">VU Score</div>
                  <div className="hood-vu-threshold threshold-high">High priority</div>
                </div>
              </div>
              <div className="hood-contextual-section">
                <div className="contextual-header">
                  <div className="contextual-title">1–2 STARS: BILLING ERROR</div>
                </div>
                <div className="contextual-questions">
                  <div className="contextual-q-item">
                    <div className="contextual-q-icon">●</div>
                    <div className="contextual-q-text">Did the bot-to-human transfer feel like a waste of your time?</div>
                  </div>
                  <div className="contextual-q-sub">Bot-to-human transfers are a top 5 1–2★ driver. A Yes names the moment of frustration.</div>
                  <div className="contextual-q-item" style={{marginTop:'10px'}}>
                    <div className="contextual-q-icon">●</div>
                    <div className="contextual-q-text">Were you left guessing about what went wrong?</div>
                  </div>
                  <div className="contextual-q-sub">For failed resolutions, customers often blame communication. A Yes confirms the explanation gap.</div>
                </div>
                <div className="hood-why-we-ask">
                  <div className="why-label">WHY WE ASK THIS</div>
                  <div className="why-point">
                    <div className="why-bullet">•</div>
                    <div className="why-text">Unexpected charges can damage trust even when resolved - understanding the emotional impact helps improve proactive error prevention</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Topic 2 */}
          <div className="hood-card">
            <div className="hood-card-top amber"></div>
            <div className="hood-card-body">
              <div className="hood-topic-label">
                <div>
                  <div className="hood-topic-pills">
                    <span className="hood-pill">Topic 2</span>
                    <span className="hood-pill hood-pill-friction">⚠ Friction</span>
                    <span className="hood-pill hood-pill-system">SYSTEM_PROCESS</span>
                  </div>
                  <div className="hood-topic-name hood-topic-highlight">Call Transfer Impact</div>
                </div>
              </div>
              <div className="hood-vu-display">
                <div className="hood-vu-num amber">32</div>
                <div className="hood-vu-meta">
                  <div className="hood-vu-label">VU Score</div>
                  <div className="hood-vu-threshold threshold-high">High priority</div>
                </div>
              </div>
              <div className="hood-contextual-section">
                <div className="contextual-header">
                  <div className="contextual-title">3 STARS: CALL TRANSFER IMPACT</div>
                </div>
                <div className="contextual-questions">
                  <div className="contextual-q-item">
                    <div className="contextual-q-icon">●</div>
                    <div className="contextual-q-text">Did that handoff from the bot cause any frustration?</div>
                  </div>
                  <div className="contextual-q-sub">The forced bot-to-human transfer due to CRM update caused sentiment drop from Positive (A) to Neutral (B). A Yes validates the friction point.</div>
                  <div className="contextual-q-item" style={{marginTop:'10px'}}>
                    <div className="contextual-q-icon">●</div>
                    <div className="contextual-q-text">Did you have to repeat yourself when Rachel took over?</div>
                  </div>
                  <div className="contextual-q-sub">Repetition on transfer is what turns a "B" interaction into a "C". A Yes isolates the context-passing failure.</div>
                </div>
                <div className="hood-why-we-ask">
                  <div className="why-label">WHY WE ASK THIS</div>
                  <div className="why-point">
                    <div className="why-bullet">•</div>
                    <div className="why-text">This question dynamically triggers because the system detected a sentiment shift from Positive (A) to Neutral (B) during the bot-to-human transfer, combined with a neutral CSAT score</div>
                  </div>
                  <div className="why-point">
                    <div className="why-bullet">•</div>
                    <div className="why-text">This aims to identify the exact friction point in the escalation path.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Topic 3 */}
          <div className="hood-card" style={{borderColor:'rgba(217,119,6,0.15)'}}>
            <div className="hood-card-top" style={{borderColor:'var(--status-warning-moderate)'}}></div>
            <div className="hood-card-body">
              <div className="hood-topic-label">
                <div>
                  <div className="hood-topic-pills">
                    <span className="hood-pill">Topic 3</span>
                    <span className="hood-pill hood-pill-critical">⚑ Critical threshold</span>
                    <span className="hood-pill grade-a">A · Positive</span>
                  </div>
                  <div className="hood-topic-name hood-topic-highlight" style={{color:'var(--status-warning-strong)'}}>Refund Processing</div>
                </div>
              </div>
              <div className="hood-vu-display" style={{background:'var(--surface-container)'}}>
                <div className="hood-vu-num" style={{color:'var(--status-warning-strong)'}}>36</div>
                <div className="hood-vu-meta">
                  <div className="hood-vu-label">VU Score</div>
                  <div className="hood-vu-threshold threshold-critical">Critical — survey triggered</div>
                </div>
              </div>
              <div className="hood-contextual-section">
                <div className="contextual-header">
                  <div className="contextual-title">4–5 STARS: UNEXPECTED BILLING CHARGE</div>
                </div>
                <div className="contextual-questions">
                  <div className="contextual-q-item">
                    <div className="contextual-q-icon">●</div>
                    <div className="contextual-q-text">Did Rachel handle the billing issue to your satisfaction?</div>
                  </div>
                  <div className="contextual-q-sub">The billing discrepancy was the primary reason for contact. A Yes confirms Rachel's resolution drove the positive outcome.</div>
                  <div className="contextual-q-item" style={{marginTop:'10px'}}>
                    <div className="contextual-q-icon">●</div>
                    <div className="contextual-q-text">Did Rachel set clear expectations on the refund timeline upfront?</div>
                  </div>
                  <div className="contextual-q-sub">Proactive expectation-setting is one of the top replicable behaviours in 4–5★ calls. A Yes isolates it as the replicable win.</div>
                </div>
                <div className="hood-why-we-ask">
                  <div className="why-label">WHY WE ASK THIS</div>
                  <div className="why-point">
                    <div className="why-bullet">•</div>
                    <div className="why-text">The agent's handling of the refund processing was the core of the positive experience - understanding how this impacted customer trust is crucial</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{textAlign:'center',marginTop:'28px'}}>
          <div style={{fontSize:'13px',color:'var(--fg-tertiary)',marginBottom:'14px'}}>End of demo flow</div>
          <button className="btn btn-primary btn-lg" onClick={() => goTo(0)}>Restart demo ↺</button>
        </div>
      </section>

      {/* STAGE 5 — SURVEY */}
      <section className={'stage' + (cur === 5 ? ' active' : '')} id="stage-5">
        <div className="page-header">
          <div>
            <div className="page-title">James receives the survey — questions already waiting</div>
            <div className="page-subtitle">Feedback Intelligence · Voice AI Survey · INT-022 · Rachel Whitman</div>
          </div>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            <button className="btn btn-secondary" onClick={() => goTo(0)}>← Back</button>
            <button className="btn btn-primary" onClick={() => goTo(1)}>Next moment →</button>
          </div>
        </div>

        <div className="survey-centered">
          {/* External contextual card */}
          {(surveyStep === 'preview' || surveyStep === 'voicewave' || surveyStep === 'askquestion' || surveyStep === 'answered') && selectedRating && contextualQuestions[selectedRating] && (
            <div className="external-context-card">
              <div className="external-card-inner">
                <div className="external-card-header">{contextualQuestions[selectedRating].title}</div>
                <div className="external-card-subtitle">Two contextual questions for this tier</div>

                {contextualQuestions[selectedRating].questions.map((q, idx) => {
                  const dIdx = answers[idx];
                  const isAnswered = dIdx !== undefined;
                  const isActive = currentQuestion === idx && (surveyStep === 'voicewave' || surveyStep === 'askquestion' || surveyStep === 'answered');
                  const isHypothesisMatch = isAnswered && q.dispositions[dIdx] && q.dispositions[dIdx].matchesHypothesis === true;

                  return (
                    <div
                      key={idx}
                      className={`external-question-block ${isAnswered ? 'answered' : ''} ${isActive ? 'active' : ''} ${isAnswered ? (isHypothesisMatch ? 'answer-match' : 'answer-nomatch') : ''}`}
                    >
                      <div className="external-q-header">
                        <span className="external-q-text">{q.text}</span>
                        {isAnswered && (
                          <span
                            className={`external-q-check ${isHypothesisMatch ? 'match' : 'nomatch'}`}
                            title={isHypothesisMatch ? 'Hypothesis confirmed' : 'Customer disagreed with hypothesis'}
                            aria-label={isHypothesisMatch ? 'Hypothesis confirmed' : 'Customer disagreed with hypothesis'}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="external-q-context">{q.context}</div>
                      {idx < contextualQuestions[selectedRating].questions.length - 1 && (
                        <div className="external-arrow">↓</div>
                      )}
                    </div>
                  );
                })}

                <div className="external-why-section">
                  <div className="external-why-label">WHY WE ASK THIS</div>
                  <div className="external-why-text">{contextualQuestions[selectedRating].why}</div>
                </div>

                {surveyStep === 'preview' && (
                  <button
                    className="external-continue-btn"
                    onClick={() => {
                      setSurveyStep('voicewave');
                      setTimeout(() => setSurveyStep('askquestion'), 2000);
                    }}
                  >
                    Continue →
                  </button>
                )}
              </div>
              <div className="connecting-arrow">→</div>
            </div>
          )}

          <div className="phone-shell">
            <div className="phone-inner">

              {/* Screen 1: Ready */}
              <div className={'phone-screen' + (phoneScreen === 1 ? ' ps-active' : '')}>
                <div className="phone-modal-hdr">
                  <div className="phone-modal-title-row">
                    <div className="phone-modal-title">Customer Feedback</div>
                    <div className="phone-modal-close">×</div>
                  </div>
                  <div className="phone-modal-sub">Interaction INT-022 · Rachel Whitman</div>
                </div>
                <div className="phone-body-wrap">
                  <div className="voice-panel">
                    <div className="voice-panel-hdr">
                      <div className="voice-panel-label">Voice AI Survey</div>
                    </div>
                    <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                      <div className="voice-avatar">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <div className="voice-state voice-state-flash">Ready to start</div>
                    </div>
                    <button onClick={() => goPhone(2)} style={{width:'100%',padding:'16px',background:'#0a84ff',border:'none',borderRadius:'14px',color:'#fff',fontSize:'17px',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'6px',fontFamily:"-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",letterSpacing:'-0.4px'}}>
                      Start Voice Survey
                    </button>
                  </div>
                  <div className="phone-dots">
                    <div className="phone-dot pd-active"></div>
                    <div className="phone-dot"></div>
                    <div className="phone-dot"></div>
                  </div>
                </div>
              </div>

              {/* Screen 2: Rating */}
              <div className={'phone-screen' + (phoneScreen === 2 ? ' ps-active' : '')}>
                <div className="phone-modal-hdr">
                  <div className="phone-modal-title-row">
                    <div className="phone-modal-title">Customer Feedback</div>
                    <div className="phone-modal-close">×</div>
                  </div>
                  <div className="phone-modal-sub">Interaction INT-022 · Rachel Whitman</div>
                </div>
                <div className="phone-body-wrap">
                  <div className="voice-panel">
                    <div className="voice-panel-hdr">
                      <div className="voice-panel-label">Voice AI Survey</div>
                    </div>
                    {/* Initial voice animation */}
                    {surveyStep === 'listening' && (
                      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                        <div className="survey-voice-wave-container">
                          <div className="survey-voice-bar"></div>
                          <div className="survey-voice-bar"></div>
                          <div className="survey-voice-bar"></div>
                          <div className="survey-voice-bar"></div>
                          <div className="survey-voice-bar"></div>
                        </div>
                        <div className="voice-state" style={{marginTop:'24px',marginBottom:0}}>Listening for rating…</div>
                      </div>
                    )}

                    {/* Thank you message */}
                    {surveyStep === 'thankyou' && (
                      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                        <div className="voice-avatar" style={{width:'52px',height:'52px',margin:'0 auto 16px'}}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                        </div>
                        <div style={{fontSize:'17px',color:'#ffffff',textAlign:'center',fontWeight:500,letterSpacing:'-0.4px'}}>Thank you for taking your time...</div>
                      </div>
                    )}

                    {/* Rating question */}
                    {surveyStep === 'question' && (
                      <>
                        <div className="voice-avatar" style={{width:'52px',height:'52px',margin:'0 auto 8px'}}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                        </div>
                        <div className="voice-state">Listening for rating…</div>
                        <div className="voice-bubble-ai" style={{marginBottom:'16px'}}>Hi! On a scale of 1 to 5, how satisfied were you with Rachel's handling of your request today?</div>
                        <div className="rating-section">
                          <div className="rating-section-label">Select your rating</div>
                          <div className="rating-btns">
                            <button className={'rating-btn r-low' + (selectedRating === 1 ? ' r-selected' : '')} onClick={() => pickRating(1)}>1<span className="r-star">★</span></button>
                            <button className={'rating-btn r-low' + (selectedRating === 2 ? ' r-selected' : '')} onClick={() => pickRating(2)}>2<span className="r-star">★</span></button>
                            <button className={'rating-btn r-mid' + (selectedRating === 3 ? ' r-selected' : '')} onClick={() => pickRating(3)}>3<span className="r-star">★</span></button>
                            <button className={'rating-btn r-high' + (selectedRating === 4 ? ' r-selected' : '')} onClick={() => pickRating(4)}>4<span className="r-star">★</span></button>
                            <button className={'rating-btn r-high' + (selectedRating === 5 ? ' r-selected' : '')} onClick={() => pickRating(5)}>5<span className="r-star">★</span></button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Preview - show rating with highlight */}
                    {surveyStep === 'preview' && (
                      <>
                        <div className="voice-avatar" style={{width:'52px',height:'52px',margin:'0 auto 8px'}}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                        </div>
                        <div className="voice-state">Rating selected</div>
                        <div className="voice-bubble-ai" style={{marginBottom:'16px'}}>Hi! On a scale of 1 to 5, how satisfied were you with Rachel's handling of your request today?</div>
                        <div className="rating-section">
                          <div className="rating-section-label">Your rating: {selectedRating}★</div>
                          <div className="rating-btns">
                            <button className={'rating-btn r-low' + (selectedRating === 1 ? ' r-selected' : '')} disabled>1<span className="r-star">★</span></button>
                            <button className={'rating-btn r-low' + (selectedRating === 2 ? ' r-selected' : '')} disabled>2<span className="r-star">★</span></button>
                            <button className={'rating-btn r-mid' + (selectedRating === 3 ? ' r-selected' : '')} disabled>3<span className="r-star">★</span></button>
                            <button className={'rating-btn r-high' + (selectedRating === 4 ? ' r-selected' : '')} disabled>4<span className="r-star">★</span></button>
                            <button className={'rating-btn r-high' + (selectedRating === 5 ? ' r-selected' : '')} disabled>5<span className="r-star">★</span></button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Voice wave before question */}
                    {surveyStep === 'voicewave' && (
                      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                        <div className="survey-voice-wave-container">
                          <div className="survey-voice-bar"></div>
                          <div className="survey-voice-bar"></div>
                          <div className="survey-voice-bar"></div>
                          <div className="survey-voice-bar"></div>
                          <div className="survey-voice-bar"></div>
                        </div>
                        <div className="voice-state" style={{marginTop:'24px',marginBottom:0}}>Asking question...</div>
                      </div>
                    )}

                    {/* Ask contextual question — buttons + inline verbatim block (no navigation) */}
                    {surveyStep === 'askquestion' && selectedRating && contextualQuestions[selectedRating] && (() => {
                      const q = contextualQuestions[selectedRating].questions[currentQuestion]
                      const selected = justAnswered !== null
                      const handlePick = (dIdx) => {
                        if (justAnswered !== null) return
                        setAnswers({ ...answers, [currentQuestion]: dIdx })
                        setJustAnswered(dIdx)
                        // No auto-advance — wait for the customer to click Continue.
                      }
                      const handleContinue = () => {
                        setJustAnswered(null)
                        if (currentQuestion < contextualQuestions[selectedRating].questions.length - 1) {
                          setCurrentQuestion(currentQuestion + 1)
                          setSurveyStep('voicewave')
                          setTimeout(() => setSurveyStep('askquestion'), 2000)
                        } else {
                          goPhone('done')
                        }
                      }
                      return (
                        <>
                          <div className="voice-avatar" style={{width:'44px',height:'44px',margin:'0 auto 6px'}}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                          </div>
                          <div className="voice-state">{selected ? 'Verbatim captured' : 'Your turn to respond'}</div>
                          <div className="voice-bubble-ai">{q.text}</div>
                          <div className="response-section">
                            <div className="response-label">{justAnswered === null ? 'Choose your response' : 'Your response'}</div>
                            {q.dispositions.map((d, dIdx) => {
                              // After a pick, keep ONLY the selected disposition visible so the customer's
                              // chosen answer stays anchored above the verbatim block.
                              if (justAnswered !== null && justAnswered !== dIdx) return null
                              return (
                                <button
                                  key={dIdx}
                                  className={`resp-btn resp-${d.tone}` + (justAnswered === dIdx ? ' resp-selected' : '')}
                                  disabled={justAnswered !== null}
                                  onClick={() => handlePick(dIdx)}
                                >
                                  <span className="resp-tag">{d.tone === 'positive' ? 'Positive' : 'Negative'}</span>
                                  {d.label}
                                </button>
                              )
                            })}

                            {/* Inline verbatim block — only when a disposition is picked */}
                            {justAnswered !== null && (
                              <>
                                <div className="inline-verbatim">
                                  <div className="voice-wave">
                                    <div className="voice-bar"></div>
                                    <div className="voice-bar"></div>
                                    <div className="voice-bar"></div>
                                    <div className="voice-bar"></div>
                                    <div className="voice-bar"></div>
                                  </div>
                                  <div className="inline-verbatim-text">
                                    <WordTypewriter text={q.dispositions[justAnswered].verbatim} msPerWord={15} />
                                  </div>
                                  <div className="inline-verbatim-cap">Verbatim captured · Feedback Intelligence</div>
                                </div>

                                {/* Continue — advances to next question or Done */}
                                <button className="continue-btn" onClick={handleContinue}>
                                  {currentQuestion < contextualQuestions[selectedRating].questions.length - 1 ? 'Continue →' : 'Finish survey →'}
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )
                    })()}
                  </div>
                  <div className="phone-dots">
                    <div className="phone-dot pd-active"></div>
                    <div className="phone-dot"></div>
                    <div className="phone-dot"></div>
                  </div>
                </div>
              </div>

              {/* Screen 3: Q1 */}
              <div className={'phone-screen' + (phoneScreen === 3 ? ' ps-active' : '')}>
                <div className="phone-modal-hdr">
                  <div className="phone-modal-title-row">
                    <div className="phone-modal-title">Customer Feedback</div>
                    <div className="phone-modal-close">×</div>
                  </div>
                  <div className="phone-modal-sub">Interaction INT-022 · Rachel Whitman</div>
                </div>
                <div className="phone-body-wrap">
                  <div className="voice-panel" style={{justifyContent:'flex-start'}}>
                    <div className="voice-panel-hdr">
                      <div className="voice-panel-label">Voice AI Survey</div>
                    </div>
                    <div className="voice-avatar" style={{width:'44px',height:'44px',margin:'0 auto 6px'}}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div className="voice-state">Your turn to respond</div>
                    <div className="voice-bubble-ai">Hi! On a scale of 1 to 5, how satisfied were you with Rachel's handling of your request today?</div>
                    <div className="voice-bubble-user">I'd say a 3 out of 5.</div>
                    <div className="voice-bubble-ai">I appreciate the feedback. If you have just another moment, I'd love your thoughts on two short questions.</div>
                    <div className="voice-bubble-ai" style={{marginTop:'4px'}}>Did that handoff from the bot cause any frustration?</div>
                    <div className="response-section">
                      <div className="response-label">Choose your response</div>
                      <button className="resp-btn resp-yes" onClick={() => goPhone(4)}>
                        <span className="resp-tag">Yes</span>
                        Yes, it did — I was already verified and then had to start again with a human.
                      </button>
                      <button className="resp-btn resp-no" onClick={() => goPhone('done')}>
                        <span className="resp-tag">No</span>
                        No, the handoff itself was smooth enough.
                      </button>
                    </div>
                  </div>
                  <div className="phone-dots">
                    <div className="phone-dot pd-active"></div>
                    <div className="phone-dot pd-active"></div>
                    <div className="phone-dot"></div>
                  </div>
                </div>
              </div>

              {/* Screen 4: Q2 */}
              <div className={'phone-screen' + (phoneScreen === 4 ? ' ps-active' : '')}>
                <div className="phone-modal-hdr">
                  <div className="phone-modal-title-row">
                    <div className="phone-modal-title">Customer Feedback</div>
                    <div className="phone-modal-close">×</div>
                  </div>
                  <div className="phone-modal-sub">Interaction INT-022 · Rachel Whitman</div>
                </div>
                <div className="phone-body-wrap">
                  <div className="voice-panel" style={{justifyContent:'flex-start'}}>
                    <div className="voice-panel-hdr">
                      <div className="voice-panel-label">Voice AI Survey</div>
                    </div>
                    <div className="voice-avatar" style={{width:'44px',height:'44px',margin:'0 auto 6px'}}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div className="voice-state">Your turn to respond</div>
                    <div className="voice-bubble-ai">Did that handoff from the bot cause any frustration?</div>
                    <div className="voice-bubble-user">Yes, it did — I was already verified and then had to start again with a human.</div>
                    <div className="voice-bubble-ai">Thanks. One more — Did you have to repeat yourself when Rachel took over?</div>
                    <div className="response-section">
                      <div className="response-label">Choose your response</div>
                      <button className="resp-btn resp-yes" onClick={() => goPhone('done')}>
                        <span className="resp-tag">Yes</span>
                        Yes, I had to re-explain the whole billing issue from scratch.
                      </button>
                      <button className="resp-btn resp-no" onClick={() => goPhone('done')}>
                        <span className="resp-tag">No</span>
                        No, Rachel had my info and picked up right where the bot left off.
                      </button>
                    </div>
                  </div>
                  <div className="phone-dots">
                    <div className="phone-dot pd-active"></div>
                    <div className="phone-dot pd-active"></div>
                    <div className="phone-dot pd-active"></div>
                  </div>
                </div>
              </div>

              {/* Done screen */}
              <div className={'phone-screen' + (phoneScreen === 'done' ? ' ps-active' : '')}>
                <div className="survey-done-screen">
                  <div className="done-check">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0a84ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div className="done-title">Thank you, James.</div>
                  <div className="done-sub">Your feedback has been recorded.<br/>FI is routing the signal now.</div>
                  <div className="done-signal-card">
                    <div className="done-signal-label">✦ FI signal processed</div>
                    <div className="done-signal-line">
                      Root cause: SYSTEM_PROCESS<br/>
                      Agent Rachel: protected<br/>
                      Routing to: Operations Manager<br/>
                      Cohort: Call Transfer Impact (+890)
                    </div>
                  </div>
                  <button className="done-restart" onClick={() => { goPhone(1); setSelectedRating(null); }}>← Restart survey</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const CSS_TEXT = `
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --brand-50: #eff6ff;
  --brand-100: #dbeafe;
  --brand-200: #bfdbfe;
  --brand-300: #93c5fd;
  --brand-400: #60a5fa;
  --brand-500: #3b82f6;
  --brand-600: #2563eb;
  --brand-700: #1d4ed8;
  --brand-800: #1e40af;
  --brand-900: #1e3a8a;

  --surface-shell: #f8fafc;
  --surface-base: #ffffff;
  --surface-container: #f1f5f9;
  --surface-container-subtle: #f8fafc;
  --surface-overlay: #ffffff;
  --surface-ai: #eef2ff;

  --fg-default: #0f172a;
  --fg-secondary: #475569;
  --fg-tertiary: #94a3b8;
  --fg-action: #2563eb;
  --fg-on-primary: #ffffff;

  --bg-primary: #2563eb;
  --bg-secondary: #f1f5f9;
  --bg-ai: #eef2ff;

  --status-success-strong: #16a34a;
  --status-success-moderate: #4ade80;
  --status-success-subtle: #dcfce7;
  --status-critical-strong: #dc2626;
  --status-critical-subtle: #fee2e2;
  --status-warning-strong: #b45309;
  --status-warning-moderate: #d97706;
  --status-warning-subtle: #fef3c7;
  --status-info-strong: #2563eb;
  --status-info-subtle: #dbeafe;

  --border-subtle: rgba(15,23,42,0.06);
  --border-soft: rgba(15,23,42,0.10);
  --border-medium: rgba(15,23,42,0.16);
  --border-strong: rgba(15,23,42,0.24);
  --border-active: #2563eb;

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.04);
  --shadow-xl: 0 16px 40px rgba(0,0,0,0.14), 0 8px 16px rgba(0,0,0,0.06);

  --r-sm: 6px;
  --r-md: 8px;
  --r-lg: 12px;
  --r-xl: 16px;
  --r-2xl: 20px;

  --ai-purple: #6366f1;
  --ai-purple-subtle: #eef2ff;
  --ai-purple-border: rgba(99,102,241,0.2);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--surface-shell);
  color: var(--fg-default);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

.progress-bar {
  position: fixed; top: 0; left: 0; right: 0;
  height: 2px; background: var(--border-subtle); z-index: 200;
}
.progress-fill {
  height: 100%;
  background: var(--brand-600);
  width: 0%; transition: width 0.4s ease;
}

.top-nav {
  position: fixed; top: 0; left: 0; right: 0;
  height: 52px;
  background: var(--surface-base);
  border-bottom: 1px solid var(--border-soft);
  display: flex; align-items: center;
  padding: 0 32px; gap: 16px; z-index: 100;
  box-shadow: var(--shadow-sm);
}
.nav-logo {
  display: flex; align-items: center; gap: 8px;
  font-size: 15px; font-weight: 600; color: var(--fg-default);
  letter-spacing: -0.01em;
}
.nav-breadcrumb {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--fg-tertiary);
}
.nav-breadcrumb span { color: var(--fg-secondary); }
.nav-sep { color: var(--fg-tertiary); }
.nav-spacer { flex: 1; }
.nav-stage-pills { display: flex; gap: 4px; }
.nav-pill {
  padding: 4px 12px; border-radius: 20px;
  font-size: 12px; font-weight: 500;
  cursor: pointer; transition: all 0.2s;
  color: var(--fg-tertiary);
  border: 1px solid transparent;
  background: none;
}
.nav-pill:hover { color: var(--fg-secondary); background: var(--surface-container); }
.nav-pill.active {
  background: var(--brand-50);
  border-color: var(--brand-200);
  color: var(--brand-700);
}

.stage {
  display: none;
  min-height: 100vh;
  padding: 72px 48px 20px;
  animation: fadeUp 0.4s ease;
}
.stage.active { display: flex; flex-direction: column; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  display: flex; align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}
.act-label {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 10px; border-radius: 20px;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  margin-bottom: 10px;
}
.act-label.act1 { background: var(--ai-purple-subtle); color: var(--ai-purple); border: 1px solid var(--ai-purple-border); }
.act-label.act2 { background: var(--surface-container); color: var(--fg-secondary); border: 1px solid var(--border-soft); }
.act-label.act3 { background: var(--status-info-subtle); color: var(--status-info-strong); border: 1px solid var(--brand-200); }

.page-title {
  font-size: 22px; font-weight: 600;
  color: var(--fg-default);
  letter-spacing: -0.02em;
  line-height: 28px;
}
.page-subtitle {
  font-size: 14px; color: var(--fg-tertiary);
  margin-top: 4px; line-height: 20px;
}

.card {
  background: var(--surface-base);
  border: 1px solid var(--border-subtle);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-sm);
}

.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px; border-radius: var(--r-md);
  font-size: 14px; font-weight: 500;
  cursor: pointer; transition: all 0.15s;
  border: none; white-space: nowrap;
  font-family: 'Inter', sans-serif;
}
.btn-primary { background: var(--bg-primary); color: #fff; }
.btn-primary:hover { background: var(--brand-700); }
.btn-secondary {
  background: var(--surface-base);
  color: var(--fg-secondary);
  border: 1px solid var(--border-soft);
}
.btn-secondary:hover { background: var(--surface-container); color: var(--fg-default); }
.btn-lg { padding: 12px 24px; font-size: 15px; }

.badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px; border-radius: 20px;
  font-size: 12px; font-weight: 500;
}
.badge-success { background: var(--status-success-subtle); color: var(--status-success-strong); }
.badge-warning { background: var(--surface-container); color: var(--fg-secondary); border: 1px solid var(--border-soft); }
.badge-critical { background: var(--status-critical-subtle); color: var(--status-critical-strong); }
.badge-info { background: var(--status-info-subtle); color: var(--status-info-strong); }
.badge-ai { background: var(--ai-purple-subtle); color: var(--ai-purple); }
.badge-neutral { background: var(--surface-container); color: var(--fg-secondary); border: 1px solid var(--border-soft); }

.grade {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 20px;
  font-size: 11px; font-weight: 600;
}
.grade-a { background: var(--surface-container); color: var(--status-success-strong); border: 1px solid rgba(22,163,74,0.2); }
.grade-b { background: var(--surface-container); color: var(--fg-secondary); border: 1px solid var(--border-soft); }

.vu-formula {
  display: flex; align-items: center; gap: 6px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 13px;
}
.vu-chip {
  padding: 2px 8px; border-radius: 5px;
  font-weight: 700; font-size: 13px;
}
.vu-w { background: var(--surface-container); color: var(--fg-secondary); border: 1px solid var(--border-soft); }
.vu-i { background: var(--surface-container); color: var(--fg-secondary); border: 1px solid var(--border-soft); }
.vu-m { background: var(--ai-purple-subtle); color: var(--ai-purple); }
.vu-r { background: var(--surface-container); color: var(--status-success-strong); font-size: 15px; border: 1px solid rgba(22,163,74,0.15); }
.vu-r-crit { background: var(--surface-container); color: var(--fg-default); font-size: 15px; border: 1px solid var(--border-soft); }
.vu-sep { color: var(--fg-tertiary); font-size: 12px; }

.evidence {
  padding: 10px 12px;
  background: var(--surface-container);
  border-left: 2px solid var(--border-active);
  border-radius: 0 var(--r-sm) var(--r-sm) 0;
  font-size: 12px; font-style: italic;
  color: var(--fg-secondary); line-height: 1.5;
  margin-top: 10px;
}
.evidence-who {
  font-size: 11px; color: var(--fg-tertiary);
  margin-top: 3px; font-style: normal;
}

.ai-panel-header {
  display: flex; align-items: center; gap: 8px;
  padding: 14px 20px;
  background: var(--ai-purple-subtle);
  border-bottom: 1px solid var(--ai-purple-border);
  border-radius: var(--r-lg) var(--r-lg) 0 0;
  height: 64px;
}
.ai-spark { font-size: 13px; color: var(--brand-600); }
.ai-panel-topic {
  font-size: 14px; font-weight: 700; color: var(--fg-default);
  letter-spacing: -0.01em; flex: 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ai-std-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px; border-radius: 20px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
  background: rgba(99,102,241,0.12); color: var(--ai-purple);
  border: 1px solid var(--ai-purple-border);
}
.ai-processing { display: flex; gap: 3px; margin-left: 6px; }
.ai-dot {
  width: 4px; height: 4px; border-radius: 50%;
  background: var(--ai-purple);
  animation: aiPulse 1.2s infinite;
}
.ai-dot:nth-child(2) { animation-delay: 0.2s; }
.ai-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes aiPulse {
  0%,80%,100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

.bubble-highlight {
  background: var(--brand-100);
  border-radius: 3px;
  padding: 1px 3px;
  font-weight: 600;
  color: var(--brand-800);
}

.inline-detection-pill {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  background: var(--status-warning-subtle);
  border: 1px solid rgba(217,119,6,0.2);
  font-size: 11px; font-weight: 600;
}
.idp-topic { color: var(--status-warning-strong); }
.idp-shift { color: var(--fg-secondary); font-weight: 500; }
.idp-from { color: var(--status-success-strong); font-weight: 600; }
.idp-to { color: var(--status-warning-strong); font-weight: 600; }

.divider { height: 1px; background: var(--border-subtle); margin: 16px 0; }

.msg-animated {
  opacity: 1; transform: translateY(0);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.msg-animated.msg-hidden {
  opacity: 0; transform: translateY(8px);
}
.msg-animated.msg-visible {
  opacity: 1; transform: translateY(0);
}
.det-card-animated {
  opacity: 1; transform: translateX(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.det-card-animated.det-hidden {
  opacity: 0; transform: translateX(12px);
}
.det-card-animated.det-visible {
  opacity: 1; transform: translateX(0);
}
.detection-eyebrow-animated {
  opacity: 1; transition: opacity 0.3s ease;
}
.detection-eyebrow-animated.det-hidden { opacity: 0; }
.detection-eyebrow-animated.det-visible { opacity: 1; }

.chat-play-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: 20px;
  font-size: 12px; font-weight: 600;
  background: var(--brand-50); color: var(--brand-700);
  border: 1px solid var(--brand-200);
  cursor: pointer; font-family: 'Inter', sans-serif;
  transition: all 0.15s;
  min-width: 105px; justify-content: center;
  height: 28px;
}
.chat-play-btn:hover { background: var(--brand-100); }
.chat-play-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.btn-voice-wave {
  display: inline-flex; align-items: center; gap: 2px; height: 14px;
}
.btn-vb {
  width: 2px; border-radius: 1px;
  background: var(--brand-700);
  animation: voiceBar 0.8s ease-in-out infinite alternate;
}
.btn-vb:nth-child(1) { height: 4px; animation-delay: 0.0s; }
.btn-vb:nth-child(2) { height: 10px; animation-delay: 0.1s; }
.btn-vb:nth-child(3) { height: 14px; animation-delay: 0.2s; }
.btn-vb:nth-child(4) { height: 8px; animation-delay: 0.15s; }
.btn-vb:nth-child(5) { height: 11px; animation-delay: 0.05s; }

.typing-indicator {
  display: flex; align-items: center; gap: 10px;
  padding: 0 0 4px;
  min-height: 32px;
  opacity: 0;
  visibility: hidden;
}
.typing-indicator.ti-active {
  opacity: 1;
  visibility: visible;
}
.voice-wave {
  display: flex; align-items: center; gap: 3px; height: 20px;
}
.voice-bar {
  width: 3px; border-radius: 2px;
  background: var(--ai-purple);
  animation: voiceBar 0.8s ease-in-out infinite alternate;
}
.voice-bar:nth-child(1) { height: 6px;  animation-delay: 0.0s; }
.voice-bar:nth-child(2) { height: 14px; animation-delay: 0.1s; }
.voice-bar:nth-child(3) { height: 18px; animation-delay: 0.2s; }
.voice-bar:nth-child(4) { height: 10px; animation-delay: 0.3s; }
.voice-bar:nth-child(5) { height: 16px; animation-delay: 0.15s; }
.voice-bar:nth-child(6) { height: 8px;  animation-delay: 0.25s; }
.voice-bar:nth-child(7) { height: 13px; animation-delay: 0.05s; }
@keyframes voiceBar {
  from { transform: scaleY(0.3); opacity: 0.4; }
  to   { transform: scaleY(1);   opacity: 1; }
}
.typing-label { font-size: 11px; color: var(--fg-tertiary); }

#stage-0 {
  background: var(--surface-base);
  align-items: center; justify-content: center;
  text-align: center;
}
.landing-header { margin-bottom: 10px; }
.landing-title {
  font-size: 32px; font-weight: 700;
  color: var(--fg-default); letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.landing-subtitle {
  font-size: 16px; color: var(--fg-tertiary);
  margin-bottom: 48px;
}
.landing-cards {
  display: flex; gap: 24px; justify-content: center;
  max-width: 860px; width: 100%;
}
.landing-card {
  flex: 1; max-width: 380px;
  background: var(--surface-base);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-xl);
  padding: 32px 28px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}
.landing-card:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--brand-300);
  transform: translateY(-2px);
}
.landing-card-arrow {
  position: absolute; top: 28px; right: 24px;
  color: var(--fg-tertiary); font-size: 18px;
  transition: transform 0.2s, color 0.2s;
}
.landing-card:hover .landing-card-arrow {
  transform: translateX(3px); color: var(--brand-600);
}
.landing-card-icon {
  width: 48px; height: 48px; border-radius: 12px;
  background: var(--brand-50);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; margin-bottom: 20px;
  border: 1px solid var(--brand-100);
}
.landing-card-title {
  font-size: 18px; font-weight: 600; color: var(--fg-default);
  margin-bottom: 10px; letter-spacing: -0.01em;
}
.landing-card-desc {
  font-size: 14px; color: var(--fg-secondary);
  line-height: 1.6; margin-bottom: 20px;
}
.landing-card-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.landing-tag {
  padding: 3px 10px; border-radius: 20px;
  font-size: 12px; font-weight: 500;
  background: #dcfce7; color: #15803d;
}
.landing-tag-amber {
  background: var(--surface-container); color: var(--fg-secondary); border: 1px solid var(--border-soft);
}
.landing-card-soon { opacity: 0.55; cursor: default; }
.landing-card-soon:hover {
  box-shadow: none; border-color: var(--border-soft); transform: none;
}
.coming-soon-tag {
  padding: 3px 10px; border-radius: 20px;
  font-size: 12px; font-weight: 500;
  background: var(--surface-container); color: var(--fg-secondary); border: 1px solid var(--border-soft);
}
.landing-nice-logo {
  display: flex; align-items: center; gap: 8px;
  justify-content: center; margin-bottom: 48px;
}
.landing-nice-mark {
  width: 32px; height: 32px; border-radius: 8px;
  background: var(--brand-600);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: #fff;
}
.landing-nice-name {
  font-size: 15px; font-weight: 700; color: var(--fg-default);
  letter-spacing: -0.01em;
}

.convo-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px; flex: 1;
  align-items: start;
}
.convo-grid > * {
  margin-top: 0;
}

.chat-card {
  background: var(--surface-base);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-md);
  display: flex; flex-direction: column;
  overflow: hidden;
  margin: 0;
}
.chat-top-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--surface-container);
  height: 64px;
}
.chat-top-info { flex: 1; }
.chat-top-title { font-size: 14px; font-weight: 500; color: var(--fg-default); }
.chat-top-sub { font-size: 12px; color: var(--fg-tertiary); margin-top: 1px; }
.live-indicator {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 12px; border-radius: 20px;
  font-size: 12px; font-weight: 600;
  background: var(--status-critical-subtle);
  color: var(--status-critical-strong);
}
.live-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--status-critical-strong);
  animation: livePulse 1.5s infinite;
}
@keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
.human-indicator { background: var(--status-info-subtle); color: var(--status-info-strong); }
.human-dot { background: var(--status-info-strong); }

.chat-body {
  flex: 1; padding: 20px;
  display: flex; flex-direction: column; gap: 14px;
  overflow-y: auto;
  min-height: 400px;
  position: relative;
}

.msg { display: flex; gap: 10px; align-items: flex-start; }
.msg.msg-customer { flex-direction: row-reverse; }
.avatar {
  width: 30px; height: 30px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; flex-shrink: 0;
}
.av-ai { background: linear-gradient(135deg, var(--ai-purple), var(--brand-600)); color: #fff; }
.av-human { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: #fff; }
.av-customer { background: var(--surface-container); color: var(--fg-secondary); border: 1px solid var(--border-soft); }
.msg-wrap { max-width: 74%; }
.msg-sender {
  font-size: 11px; font-weight: 600; color: var(--fg-tertiary);
  margin-bottom: 4px; display: flex; align-items: center; gap: 5px;
}
.msg-customer .msg-sender { justify-content: flex-end; }
.role-tag {
  padding: 1px 6px; border-radius: 4px;
  font-size: 10px; font-weight: 700; text-transform: uppercase;
}
.role-ai { background: var(--ai-purple-subtle); color: var(--ai-purple); }
.role-human { background: var(--status-info-subtle); color: var(--status-info-strong); }
.bubble {
  padding: 10px 14px; border-radius: 4px 12px 12px 12px;
  font-size: 14px; line-height: 20px;
  background: var(--surface-container);
  border: 1px solid var(--border-subtle);
  color: var(--fg-default);
}
.msg-customer .bubble {
  border-radius: 12px 4px 12px 12px;
  background: var(--brand-50);
  border-color: var(--brand-100);
  color: var(--fg-default);
  text-align: right;
}
.bubble-friction { background: var(--surface-container); border-color: var(--border-soft); }
.msg-ts { font-size: 10px; color: var(--fg-tertiary); margin-top: 3px; }
.msg-customer .msg-ts { text-align: right; }

.transfer-banner {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px;
  background: var(--surface-container); border: 1px solid var(--border-soft);
  border-radius: var(--r-md);
  font-size: 13px; font-weight: 500;
  color: var(--fg-secondary);
}
.transfer-icon { font-size: 16px; }

.sentiment-strip {
  padding: 12px 20px;
  border-top: 1px solid var(--border-subtle);
  background: var(--surface-container);
}
.sentiment-label-row {
  display: flex; justify-content: space-between;
  font-size: 11px; color: var(--fg-tertiary); margin-bottom: 6px;
}
.sentiment-track {
  height: 3px; background: var(--border-subtle);
  border-radius: 2px; overflow: hidden;
}
.sentiment-fill {
  height: 100%; border-radius: 2px;
  transition: width 1s ease, background 1s ease;
}

.detection-col { display: flex; flex-direction: column; gap: 14px; }
.detection-eyebrow {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--fg-tertiary); margin-bottom: 2px;
}
.detection-eyebrow.amber { color: var(--status-warning-moderate); }
.detection-eyebrow.green { color: var(--status-success-strong); }

.det-card {
  background: var(--surface-base);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin: 0;
}
.det-card-body { padding: 16px; }

.hood-grid {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 20px; flex: 1;
}
.hood-card {
  background: var(--surface-base);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex; flex-direction: column;
}
.hood-card-top { border-top: 3px solid; }
.hood-card-top.green { border-color: var(--status-success-strong); }
.hood-card-top.amber { border-color: var(--status-warning-moderate); }
.hood-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 14px; }
.hood-topic-label { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
.hood-topic-name { font-size: 16px; font-weight: 600; color: var(--fg-default); letter-spacing: -0.01em; min-height: 24px; }
.hood-topic-highlight { font-size: 18px; font-weight: 700; color: var(--brand-700); min-height: 24px; }
.hood-topic-pills { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; flex-wrap: wrap; }
.hood-pill {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 20px;
  font-size: 11px; font-weight: 600;
  background: var(--surface-container); color: var(--fg-secondary);
  border: 1px solid var(--border-soft);
  white-space: nowrap;
}
.hood-pill.grade-a { background: var(--status-success-subtle); color: var(--status-success-strong); border-color: rgba(22,163,74,0.2); }
.hood-pill-friction { background: var(--status-warning-subtle); color: var(--status-warning-strong); border-color: rgba(217,119,6,0.25); }
.hood-pill-critical { background: var(--status-critical-subtle); color: var(--status-critical-strong); border-color: rgba(220,38,38,0.2); }
.hood-pill-system { background: var(--status-critical-subtle); color: var(--status-critical-strong); border-color: rgba(220,38,38,0.2); }
.hood-vu-display {
  display: flex; align-items: baseline; gap: 8px;
  padding: 16px;
  background: var(--surface-container);
  border-radius: var(--r-lg);
  min-height: 92px;
}
.hood-vu-num { font-size: 44px; font-weight: 700; line-height: 1; letter-spacing: -0.03em; }
.hood-vu-num.green { color: var(--status-success-strong); }
.hood-vu-num.amber { color: var(--status-warning-moderate); }
.hood-vu-meta { display: flex; flex-direction: column; gap: 4px; }
.hood-vu-label { font-size: 12px; color: var(--fg-tertiary); }
.hood-vu-threshold { font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
.threshold-critical { background: var(--surface-container); color: var(--fg-secondary); border: 1px solid var(--border-soft); }
.threshold-high { background: var(--status-info-subtle); color: var(--status-info-strong); border: 1px solid rgba(37,99,235,0.15); }
.hood-formula {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 12px;
  background: var(--surface-container);
  border-radius: var(--r-md);
}
.hood-evidence { padding: 10px 12px; background: var(--surface-container); border-radius: var(--r-md); }
.hood-evidence-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--fg-tertiary); margin-bottom: 5px; }
.hood-evidence-text { font-size: 12px; color: var(--fg-secondary); font-style: italic; line-height: 1.5; }
.hood-evidence-who { font-size: 10px; color: var(--fg-tertiary); margin-top: 3px; font-style: normal; }
.hood-questions {
  background: var(--ai-purple-subtle);
  border: 1px solid var(--ai-purple-border);
  border-radius: var(--r-lg); overflow: hidden;
  margin-top: auto;
}
.hood-q-header {
  padding: 8px 12px;
  background: rgba(99,102,241,0.08);
  border-bottom: 1px solid var(--ai-purple-border);
  font-size: 11px; font-weight: 600; color: var(--ai-purple);
  display: flex; align-items: center; gap: 6px;
}
.hood-q-item {
  display: flex; align-items: flex-start; gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--ai-purple-border);
  font-size: 12px; color: var(--fg-secondary); line-height: 1.4;
}
.hood-q-item:last-child { border-bottom: none; }
.hood-q-num {
  width: 16px; height: 16px; border-radius: 50%;
  background: rgba(99,102,241,0.15); color: var(--ai-purple);
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; flex-shrink: 0; margin-top: 1px;
}
.hood-root-chain { display: flex; flex-direction: column; gap: 8px; }
.chain-item { display: flex; gap: 10px; }
.chain-num {
  width: 20px; height: 20px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; flex-shrink: 0;
}
.cn-green { background: var(--status-success-subtle); color: var(--status-success-strong); }
.cn-amber { background: var(--surface-container); color: var(--fg-secondary); border: 1px solid var(--border-soft); }
.chain-title { font-size: 12px; font-weight: 600; color: var(--fg-default); }
.chain-detail { font-size: 11px; color: var(--fg-secondary); margin-top: 2px; line-height: 1.4; }
.hood-contextual-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  margin-top: 14px;
}
.contextual-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-soft);
}
.contextual-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand-600);
}
.contextual-rating {
  font-size: 13px;
  font-weight: 700;
  color: var(--status-warning-moderate);
  padding: 2px 8px;
  background: var(--status-warning-subtle);
  border-radius: 4px;
  border: 1px solid rgba(217,119,6,0.2);
}
.contextual-sub-label {
  font-size: 11px;
  color: var(--fg-tertiary);
  margin-top: -6px;
  margin-bottom: 8px;
}
.contextual-questions {
  display: flex;
  flex-direction: column;
}
.contextual-q-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.contextual-q-icon {
  color: var(--fg-tertiary);
  font-size: 14px;
  line-height: 1.5;
  flex-shrink: 0;
}
.contextual-q-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--fg-default);
  line-height: 1.5;
}
.contextual-q-sub {
  font-size: 11px;
  color: var(--fg-secondary);
  line-height: 1.5;
  margin-left: 22px;
  margin-top: 4px;
  font-style: italic;
}
.hood-why-we-ask {
  background: var(--surface-container);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-lg);
  padding: 12px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  margin-top: auto;
}
.why-label {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--brand-600);
  margin-bottom: 10px;
}
.why-point {
  display: flex; gap: 8px; align-items: flex-start;
  margin-bottom: 8px;
}
.why-point:last-child { margin-bottom: 0; }
.why-bullet {
  color: var(--fg-tertiary);
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  line-height: 1.5;
}
.why-text {
  font-size: 11px;
  color: var(--fg-secondary);
  line-height: 1.5;
}

.survey-centered {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  padding: 0;
  /* Pull-up tuned for the page header height. Reduced after the
     "Act 3 · The Survey" pill was removed (~34px shorter). */
  margin-top: -60px;
  gap: 40px;
  position: relative;
}

.meta-card {
  background: var(--surface-base);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
.meta-header {
  padding: 14px 20px;
  background: var(--surface-container);
  border-bottom: 1px solid var(--border-subtle);
  font-size: 14px; font-weight: 500; color: var(--fg-default);
  display: flex; align-items: center; gap: 8px;
}
.meta-row {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 14px;
}
.meta-row:last-child { border-bottom: none; }
.meta-key { color: var(--fg-secondary); }
.meta-val { font-weight: 500; color: var(--fg-default); }

.q-bank {
  background: var(--surface-base);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
.q-bank-header {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--surface-container);
  display: flex; align-items: center; gap: 10px;
}
.q-bank-icon {
  width: 30px; height: 30px; border-radius: 8px;
  background: var(--ai-purple-subtle);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
}
.q-bank-title { font-size: 14px; font-weight: 500; color: var(--fg-default); }
.q-bank-sub { font-size: 12px; color: var(--fg-tertiary); margin-top: 1px; }
.q-row {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-subtle);
}
.q-row:last-child { border-bottom: none; }
.q-row.q-active { background: var(--brand-50); }
.q-tier {
  padding: 2px 8px; border-radius: 20px;
  font-size: 11px; font-weight: 600;
  white-space: nowrap; margin-top: 2px; flex-shrink: 0;
}
.q-tier-low { background: var(--surface-container); color: var(--fg-secondary); border: 1px solid var(--border-soft); }
.q-tier-mid { background: var(--brand-50); color: var(--brand-700); border: 1px solid var(--brand-200); }
.q-tier-high { background: var(--surface-container); color: var(--status-success-strong); border: 1px solid rgba(22,163,74,0.15); }
.q-text { font-size: 13px; color: var(--fg-default); line-height: 1.5; }
.q-meta { font-size: 11px; color: var(--fg-tertiary); margin-top: 2px; }

.phone-shell {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 54px;
  padding: 12px;
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  width: 393px;
}
.phone-inner {
  background: #000000;
  border-radius: 46px;
  overflow: hidden;
  height: 780px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.phone-inner::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 126px;
  height: 37px;
  background: #000000;
  border-radius: 28px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}
.phone-inner::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 5px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 3px;
  z-index: 100;
}
.phone-screen { display: none; flex-direction: column; height: 100%; }
.phone-screen.ps-active { display: flex; }
.phone-modal-hdr {
  padding: 70px 24px 16px;
  background: transparent;
}
.phone-modal-title-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 4px;
}
.phone-modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.4px;
}
.phone-modal-close {
  color: #0a84ff;
  font-size: 17px;
  cursor: pointer;
  line-height: 1;
  font-weight: 600;
}
.phone-modal-sub {
  font-size: 13px;
  color: #8e8e93;
  padding-bottom: 16px;
  border-bottom: 0.5px solid rgba(255,255,255,0.1);
  font-weight: 400;
}
.phone-body-wrap { flex: 1; display: flex; flex-direction: column; padding: 0; }
.voice-panel {
  margin: 20px;
  background: #1c1c1e;
  border-radius: 20px;
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}
.voice-panel-hdr {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.voice-panel-label {
  display: flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; color: #64748b; text-transform: uppercase;
}
.voice-ai-badge {
  padding: 2px 8px; border-radius: 20px;
  font-size: 10px; font-weight: 700;
  background: rgba(99,102,241,0.15); color: #a5b4fc;
  border: 1px solid rgba(99,102,241,0.2); letter-spacing: 0.05em;
}
.voice-avatar {
  width: 64px; height: 64px; border-radius: 50%;
  background: rgba(10, 132, 255, 0.15);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 10px;
  border: 1px solid rgba(10, 132, 255, 0.3);
  color: #0a84ff;
}
.voice-state {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.12em; color: #334155;
  text-align: center; margin-bottom: 16px; text-transform: uppercase;
}
.voice-state-flash {
  animation: flashPulse 2s ease-in-out infinite;
}
@keyframes flashPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.survey-voice-wave-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 80px;
}
.survey-voice-bar {
  width: 6px;
  background: #0a84ff;
  border-radius: 3px;
  animation: surveyVoiceBar 0.8s ease-in-out infinite alternate;
}
.survey-voice-bar:nth-child(1) { height: 20px; animation-delay: 0.0s; }
.survey-voice-bar:nth-child(2) { height: 45px; animation-delay: 0.1s; }
.survey-voice-bar:nth-child(3) { height: 60px; animation-delay: 0.2s; }
.survey-voice-bar:nth-child(4) { height: 35px; animation-delay: 0.15s; }
.survey-voice-bar:nth-child(5) { height: 50px; animation-delay: 0.05s; }
@keyframes surveyVoiceBar {
  from { transform: scaleY(0.4); opacity: 0.5; }
  to   { transform: scaleY(1);   opacity: 1; }
}
.contextual-preview-card {
  background: #1c1c1e;
  border-radius: 16px;
  padding: 20px;
  margin: 0 20px;
}
.contextual-preview-header {
  font-size: 15px;
  font-weight: 700;
  color: #0a84ff;
  letter-spacing: -0.3px;
  margin-bottom: 8px;
}
.contextual-preview-subtitle {
  font-size: 13px;
  color: #8e8e93;
  margin-bottom: 20px;
}
.contextual-preview-question {
  margin-bottom: 20px;
}
.contextual-preview-q-header {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 6px;
}
.contextual-preview-q-icon {
  color: #8e8e93;
  font-size: 14px;
  flex-shrink: 0;
  line-height: 1.5;
}
.contextual-preview-q-text {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.5;
  letter-spacing: -0.2px;
}
.contextual-preview-q-context {
  font-size: 12px;
  color: #8e8e93;
  line-height: 1.5;
  margin-left: 22px;
  font-style: italic;
}
.contextual-preview-arrow {
  text-align: center;
  color: #0a84ff;
  font-size: 20px;
  margin: 12px 0;
}
.contextual-preview-why {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 14px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.contextual-preview-why-label {
  font-size: 11px;
  font-weight: 700;
  color: #0a84ff;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
.contextual-preview-why-text {
  font-size: 12px;
  color: #8e8e93;
  line-height: 1.5;
}
.contextual-preview-continue {
  width: 100%;
  padding: 16px;
  background: #0a84ff;
  border: none;
  border-radius: 14px;
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  letter-spacing: -0.4px;
}
.external-context-card {
  position: relative;
  display: flex;
  align-items: center;
  animation: slideInLeft 0.4s ease;
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
.external-card-inner {
  width: 420px;
  background: var(--surface-base);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-xl);
  padding: 24px;
  box-shadow: var(--shadow-lg);
}
.external-card-header {
  font-size: 16px;
  font-weight: 700;
  color: var(--brand-600);
  letter-spacing: -0.3px;
  margin-bottom: 8px;
}
.external-card-subtitle {
  font-size: 13px;
  color: var(--fg-tertiary);
  margin-bottom: 20px;
}
.external-question-block {
  margin-bottom: 20px;
  padding: 12px;
  border-radius: var(--r-md);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}
.external-question-block.active {
  border-color: var(--brand-600);
  background: var(--brand-50);
}
.external-question-block.answered {
  opacity: 0.7;
}
.external-question-block.answered.answer-yes {
  border-color: #4ade80;
  background: #dcfce7;
}
.external-question-block.answered.answer-no {
  border-color: #f87171;
  background: #fee2e2;
}
.external-q-header {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 6px;
}
.external-q-icon {
  color: var(--fg-tertiary);
  font-size: 14px;
  flex-shrink: 0;
  line-height: 1.5;
}
.external-question-block.answer-yes .external-q-icon {
  color: #16a34a;
  font-weight: bold;
}
.external-question-block.answer-no .external-q-icon {
  color: #dc2626;
  font-weight: bold;
}
.external-answer-badge {
  margin-left: auto;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}
.external-question-block.answer-yes .external-answer-badge {
  background: #16a34a;
  color: #fff;
}
.external-question-block.answer-no .external-answer-badge {
  background: #dc2626;
  color: #fff;
}
/* Hypothesis-match ✓ pill — appears after the customer answers.
   Green = AI hypothesis confirmed.  Gray = customer disagreed. */
.external-q-check {
  margin-left: auto;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.external-q-check.match {
  background: var(--status-success-subtle);
  color: var(--status-success-strong);
}
.external-q-check.nomatch {
  background: rgba(148, 163, 184, 0.18);
  color: var(--fg-tertiary);
}
.external-q-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--fg-default);
  line-height: 1.5;
  letter-spacing: -0.2px;
}
.external-q-context {
  font-size: 12px;
  color: var(--fg-secondary);
  line-height: 1.5;
  margin-left: 22px;
  font-style: italic;
}
.external-arrow {
  text-align: center;
  color: var(--brand-600);
  font-size: 20px;
  margin: 12px 0;
}
.external-why-section {
  background: var(--surface-container);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-lg);
  padding: 14px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.external-why-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--brand-600);
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
.external-why-text {
  font-size: 12px;
  color: var(--fg-secondary);
  line-height: 1.5;
}
.external-continue-btn {
  width: 100%;
  padding: 14px;
  background: var(--brand-600);
  border: none;
  border-radius: var(--r-md);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.2px;
  transition: all 0.2s;
}
.external-continue-btn:hover {
  background: var(--brand-700);
}
.connecting-arrow {
  font-size: 32px;
  color: var(--brand-600);
  font-weight: bold;
  margin: 0 -10px;
  animation: arrowPulse 2s ease-in-out infinite;
}
@keyframes arrowPulse {
  0%, 100% { opacity: 1; transform: translateX(0); }
  50% { opacity: 0.6; transform: translateX(5px); }
}
.answer-bubble-yes {
  background: #4ade80 !important;
  color: #ffffff !important;
}
.answer-bubble-no {
  background: #f87171 !important;
  color: #ffffff !important;
}
.answer-validation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 14px;
  color: #8e8e93;
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.flow-structure-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 40px;
}
.flow-step {
  flex: 1;
  background: var(--surface-base);
  border-radius: var(--r-xl);
  padding: 24px;
  border: 2px solid;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease;
}
.flow-step:hover {
  transform: translateY(-4px);
}
.flow-step-blue {
  border-color: var(--brand-600);
  background: var(--brand-50);
}
.flow-step-green {
  border-color: var(--status-success-strong);
  background: var(--status-success-subtle);
}
.flow-step-amber {
  border-color: var(--status-warning-moderate);
  background: var(--status-warning-subtle);
}
.flow-step-purple {
  border-color: #7c3aed;
  background: #f5f3ff;
}
.flow-step-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.flow-step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}
.flow-step-blue .flow-step-number {
  background: var(--brand-600);
  color: #fff;
}
.flow-step-green .flow-step-number {
  background: var(--status-success-strong);
  color: #fff;
}
.flow-step-amber .flow-step-number {
  background: var(--status-warning-moderate);
  color: #fff;
}
.flow-step-purple .flow-step-number {
  background: #7c3aed;
  color: #fff;
}
.flow-step-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--fg-default);
  letter-spacing: -0.02em;
}
.flow-step-subtitle {
  font-size: 13px;
  color: var(--fg-secondary);
  margin-bottom: 16px;
  line-height: 1.5;
}
.flow-step-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.flow-step-item {
  padding: 8px 12px;
  background: var(--surface-base);
  border-radius: var(--r-md);
  font-size: 13px;
  color: var(--fg-default);
  border: 1px solid var(--border-soft);
}
.flow-arrow {
  font-size: 32px;
  font-weight: 700;
  color: var(--brand-600);
  flex-shrink: 0;
}
.voice-bubble-ai {
  background: #2c2c2e;
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.4;
  margin-bottom: 10px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  letter-spacing: -0.2px;
}
.voice-bubble-user {
  background: #0a84ff;
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.4;
  margin-bottom: 10px;
  text-align: right;
  margin-left: auto;
  max-width: 85%;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  letter-spacing: -0.2px;
}
.rating-section { margin-top: auto; }
.rating-section-label {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; color: #334155;
  text-align: center; margin-bottom: 8px; text-transform: uppercase;
}
.rating-btns { display: flex; gap: 8px; }
.rating-btn {
  flex: 1;
  padding: 14px 8px;
  border-radius: 12px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  letter-spacing: -0.4px;
}
.rating-btn .r-star { font-size: 11px; }
.r-low { }
.r-mid { }
.r-high { }
.rating-btn:hover { transform: scale(1.03); background: rgba(255, 255, 255, 0.1); }
.rating-btn.r-selected {
  transform: scale(1.05);
  background: #0a84ff;
  border-color: #0a84ff;
  box-shadow: 0 4px 12px rgba(10, 132, 255, 0.4);
}

.response-section { margin-top: auto; width: 100%; }
.response-label {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; color: #334155;
  text-align: center; margin-bottom: 8px; text-transform: uppercase;
}
.resp-btn {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  line-height: 1.4;
  margin-bottom: 10px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  letter-spacing: -0.2px;
}
.resp-btn:last-child { margin-bottom: 0; }
.resp-yes { }
.resp-yes:hover { background: rgba(255, 255, 255, 0.1); }
.resp-no { }
.resp-no:hover { background: rgba(255, 255, 255, 0.1); }

/* Disposition tints — applied on hover and when selected */
.resp-positive:hover,
.resp-positive.resp-selected {
  background: rgba(74, 222, 128, 0.16);
  border-color: rgba(74, 222, 128, 0.45);
}
.resp-positive.resp-selected .resp-tag { color: #4ade80; opacity: 1; }

.resp-negative:hover,
.resp-negative.resp-selected {
  background: rgba(248, 113, 113, 0.16);
  border-color: rgba(248, 113, 113, 0.45);
}
.resp-negative.resp-selected .resp-tag { color: #f87171; opacity: 1; }

.resp-btn:disabled { cursor: default; }
.resp-btn:disabled:not(.resp-selected) { opacity: 0.45; }

/* Inline verbatim block — appears below the buttons after a disposition is picked */
.inline-verbatim {
  margin-top: 12px;
  padding: 14px 14px 12px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.10);
  border: 1px solid rgba(99, 102, 241, 0.25);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  animation: fadeUp 0.3s ease;
}
.inline-verbatim .voice-wave {
  align-self: center;
}
.inline-verbatim-text {
  color: #ffffff;
  font-size: 13px;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: -0.1px;
}
.inline-verbatim-cap {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
  text-align: center;
  margin-top: 2px;
}

/* Continue button below the verbatim — advances to next question or Done */
.continue-btn {
  width: 100%;
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 0.5px solid rgba(255, 255, 255, 0.18);
  background: #0a84ff;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  letter-spacing: -0.2px;
  animation: fadeUp 0.3s ease;
}
.continue-btn:hover { background: #1192ff; }
.continue-btn:active { background: #007aff; }
.resp-tag {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: -0.2px;
  text-transform: capitalize;
  margin-bottom: 4px;
  opacity: 0.7;
}

.phone-dots { display: flex; justify-content: center; gap: 6px; padding: 16px 0 24px; }
.phone-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255, 255, 255, 0.2); transition: all 0.3s; }
.phone-dot.pd-active { background: #ffffff; width: 20px; border-radius: 4px; }

.survey-done-screen {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 24px; text-align: center; background: #0d0d1a;
}
.done-check { margin-bottom: 20px; display: flex; align-items: center; justify-content: center; }
.done-title { font-size: 17px; font-weight: 700; color: #f1f5f9; margin-bottom: 6px; }
.done-sub { font-size: 13px; color: #475569; line-height: 1.5; margin-bottom: 20px; }
.done-signal-card {
  width: 100%; padding: 14px 16px;
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 12px; text-align: left;
}
.done-signal-label { font-size: 10px; font-weight: 700; color: #a5b4fc; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }
.done-signal-line { font-size: 12px; color: #64748b; line-height: 1.7; }
.done-restart {
  margin-top: 14px; padding: 8px 20px;
  background: transparent; border: 1px solid rgba(99,102,241,0.25);
  border-radius: 8px; color: #a5b4fc;
  font-size: 12px; cursor: pointer; font-family: 'Inter', sans-serif;
}
`;
