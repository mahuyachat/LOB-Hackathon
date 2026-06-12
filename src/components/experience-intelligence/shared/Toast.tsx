import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'

interface ToastProps {
  message: string
  onDone: () => void
  duration?: number
}

export function Toast({ message, onDone, duration = 3500 }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300) }, duration)
    return () => clearTimeout(t)
  }, [duration, onDone])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: `translate(-50%, ${visible ? 0 : 24}px)`,
        opacity: visible ? 1 : 0,
        transition: 'all 0.3s ease',
        zIndex: 9999,
        background: '#1e293b',
        color: '#fff',
        borderRadius: 12,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.24)',
        fontSize: 14,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      <CheckCircle size={18} color="#22c55e" />
      {message}
    </div>
  )
}
