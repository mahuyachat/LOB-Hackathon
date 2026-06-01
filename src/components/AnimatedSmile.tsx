/**
 * AnimatedSmile — inline SVG logo with CSS-animated blinking eyes.
 *
 * Mirrors the structure of /public/blue_smile.svg but adds two named
 * <g> wrappers around the eye paths so they can be animated independently.
 *
 * The two eyes blink in unison every ~5s (a tiny squish in scaleY).
 * Using `transform-box: fill-box` so transform-origin resolves to the
 * element's own bounding box (centered), regardless of viewBox scaling.
 */
interface Props {
  size?: number
  className?: string
  color?: string
  /** Override CSS color used for white-on-blue contexts (e.g. landing page hero). */
  invert?: boolean
}

export function AnimatedSmile({ size = 24, className, color = '#3694FC', invert = false }: Props) {
  const fill = invert ? '#FFFFFF' : color
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo"
    >
      <style>{`
        @keyframes lyra-blink {
          0%, 100% { transform: scaleY(1); }
          50%      { transform: scaleY(0.08); }
        }
        @keyframes lyra-smile {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.08); }
        }
        .lyra-eye, .lyra-smile {
          transform-box: fill-box;
          transform-origin: center;
        }
        svg:hover .lyra-eye {
          animation: lyra-blink 0.6s ease-in-out infinite;
        }
        svg:hover .lyra-eye-right {
          animation-delay: 0.08s;
        }
        svg:hover .lyra-smile {
          animation: lyra-smile 0.8s ease-in-out infinite;
        }
      `}</style>

      {/* Big curved smile shape (top-right) */}
      <path
        className="lyra-smile"
        d="M23.7188 5.81445C23.8757 5.8146 24.0015 5.94038 24 6.0957C23.8494 15.8179 15.9182 23.6985 6.13379 23.8477C5.97839 23.8493 5.85077 23.7237 5.85059 23.5684V19.3086C5.85059 19.1563 5.97502 19.0335 6.12891 19.0303C13.2448 18.8844 19.0048 13.1599 19.1523 6.08984C19.1556 5.93599 19.2788 5.81255 19.4326 5.8125L23.7188 5.81445Z"
        fill={fill}
      />

      {/* Right eye */}
      <path
        className="lyra-eye lyra-eye-right"
        d="M12.2559 0.000976562C13.8714 0.00104033 15.1804 1.30219 15.1807 2.90625C15.1807 4.51051 13.8716 5.81244 12.2559 5.8125C10.6401 5.8125 9.33008 4.51055 9.33008 2.90625C9.33031 1.30215 10.6402 0.000976562 12.2559 0.000976562Z"
        fill={fill}
      />

      {/* Left eye */}
      <path
        className="lyra-eye lyra-eye-left"
        d="M2.92578 0C4.5412 0.000213196 5.85033 1.30132 5.85059 2.90527C5.85059 4.50944 4.54135 5.81131 2.92578 5.81152C1.31003 5.81152 0 4.50957 0 2.90527C0.000253194 1.30119 1.31018 0 2.92578 0Z"
        fill={fill}
      />
    </svg>
  )
}
