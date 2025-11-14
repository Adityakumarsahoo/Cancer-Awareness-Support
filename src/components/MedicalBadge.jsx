function MedicalBadge({ size = 56 }) {
  return (
    <span
      className="med-badge"
      role="img"
      aria-label="Hospital care badge"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="med-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#med-grad)" />
        <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        <rect x="25" y="18" width="14" height="28" rx="3" fill="#ffffff" />
        <rect x="18" y="25" width="28" height="14" rx="3" fill="#ffffff" />
      </svg>
    </span>
  )
}

export default MedicalBadge