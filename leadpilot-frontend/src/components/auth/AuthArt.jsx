export const Eye = ({ off }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M3 3l18 18" />}
  </svg>
)

const Bubble = ({ cx, cy, r, fill, delay = 0, hollow, children }) => {
  const s = r / 27
  return (
    <g className="float" style={{ animationDelay: `${delay}s` }}>
      <circle cx={cx} cy={cy} r={r + 12} fill="#fff" opacity="0.07" />
      <circle
        cx={cx} cy={cy} r={r}
        fill={hollow ? 'rgba(255,255,255,0.06)' : `url(#${fill})`}
        stroke="#fff" strokeOpacity={hollow ? 1 : 0.6} strokeWidth={hollow ? 4 : 5}
        filter="url(#glow)"
      />
      <g
        transform={`translate(${cx - 12 * s} ${cy - 12 * s}) scale(${s})`}
        fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      >
        {children}
      </g>
    </g>
  )
}

const stops = (a, b) => (<><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></>)

export default function AuthArt() {
  return (
    <div className="art" aria-hidden="true">
      <svg viewBox="0 0 520 620" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="aura"><stop offset="0" stopColor="#8f86ff" stopOpacity=".55" /><stop offset="1" stopColor="#8f86ff" stopOpacity="0" /></radialGradient>
          <linearGradient id="gOrange" x1="0" y1="0" x2="1" y2="1">{stops('#ffc46b', '#ee8a3e')}</linearGradient>
          <linearGradient id="gYellow" x1="0" y1="0" x2="1" y2="1">{stops('#ffe36e', '#f5a623')}</linearGradient>
          <linearGradient id="gBlue" x1="0" y1="0" x2="1" y2="1">{stops('#63c4ff', '#2f7cf0')}</linearGradient>
          <linearGradient id="gPurple" x1="0" y1="0" x2="1" y2="1">{stops('#d8a8ff', '#8a5af0')}</linearGradient>
          <linearGradient id="gRed" x1="0" y1="0" x2="1" y2="1">{stops('#ff8c8c', '#d3404d')}</linearGradient>
          <linearGradient id="gShirt" x1="0" y1="0" x2="1" y2="1">{stops('#8f7cff', '#5a3fe0')}</linearGradient>
          <path id="leaf" d="M0 0C30-50 110-70 200-30L150-22 192 0 140 8 172 34 112 26 122 58C60 62 20 36 0 0Z" />
        </defs>

        {/* monstera leaves */}
        <g fill="#231a9c">
          <use href="#leaf" transform="translate(540 30) rotate(150) scale(1.45)" opacity=".9" />
          <use href="#leaf" transform="translate(450 -20) rotate(118) scale(1.15)" opacity=".7" fill="#2f28b8" />
          <use href="#leaf" transform="translate(540 610) rotate(-150) scale(1.45)" opacity=".9" />
          <use href="#leaf" transform="translate(440 660) rotate(-112) scale(1.1)" opacity=".7" fill="#2f28b8" />
        </g>

        <ellipse cx="270" cy="340" rx="190" ry="230" fill="url(#aura)" />

        {/* network */}
        <g stroke="#fff" strokeOpacity=".35" strokeWidth="1.3">
          <path d="M270 330L140 220M270 330L420 160M270 330L440 300M270 330L170 410M270 330L295 475M270 330L330 120" fill="none" />
        </g>
        <g fill="#fff" opacity=".8">
          <circle cx="205" cy="275" r="3" /><circle cx="345" cy="245" r="3" /><circle cx="355" cy="315" r="3" />
          <circle cx="220" cy="370" r="3" /><circle cx="282" cy="402" r="3" />
        </g>

        {/* person */}
        <g strokeLinecap="round" fill="none">
          <path d="M292 292L338 214" stroke="#7f6bff" strokeWidth="17" />
          <path d="M248 296L236 352" stroke="#6f58f0" strokeWidth="15" />
          <path d="M256 352L246 448" stroke="#c9bcff" strokeWidth="22" />
          <path d="M286 352L302 442" stroke="#c9bcff" strokeWidth="22" />
        </g>
        <rect x="236" y="268" width="68" height="96" rx="24" fill="url(#gShirt)" />
        <circle cx="340" cy="208" r="9" fill="#f0b48e" />
        <circle cx="236" cy="356" r="9" fill="#f0b48e" />
        <circle cx="270" cy="246" r="21" fill="#f0b48e" />
        <path d="M249 244a21 21 0 0 1 42 0c-10-8-30-8-42 0z" fill="#23155c" />
        <ellipse cx="243" cy="452" rx="15" ry="7" fill="#f2f0ff" />
        <ellipse cx="306" cy="446" rx="15" ry="7" fill="#f2f0ff" />

        <Bubble cx={330} cy={112} r={36} hollow delay={-1}>
          <path d="M17 8.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1.5l4 2.5V6z" />
        </Bubble>
        <Bubble cx={420} cy={160} r={54} fill="gOrange" delay={-2}>
          <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
        </Bubble>
        <Bubble cx={440} cy={310} r={62} fill="gYellow" delay={-3}>
          <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
        </Bubble>
        <Bubble cx={140} cy={220} r={34} fill="gBlue" delay={-4}>
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
        </Bubble>
        <Bubble cx={170} cy={410} r={64} fill="gPurple" delay={-5}>
          <path d="M3 11v3a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1zM16 8a5 5 0 0 1 0 8" />
        </Bubble>
        <Bubble cx={295} cy={505} r={28} fill="gRed" delay={-2.5}>
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
        </Bubble>
      </svg>
    </div>
  )
}

