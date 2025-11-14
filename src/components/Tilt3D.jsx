import { useEffect, useRef, useState } from 'react'

// Lightweight 3D tilt wrapper using CSS perspective and transform
// Props: children, className, maxTilt (deg), scale, glare (bool)
function Tilt3D({ children, className = '', maxTilt = 12, scale = 1.02, glare = false }) {
  const outerRef = useRef(null)
  const innerRef = useRef(null)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = () => setEnabled(!reduce.matches)
    set()
    reduce.addEventListener('change', set)
    return () => reduce.removeEventListener('change', set)
  }, [])

  const handleMove = (e) => {
    if (!enabled || !outerRef.current || !innerRef.current) return
    const rect = outerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = (x / rect.width) * 2 - 1 // -1 to 1
    const py = (y / rect.height) * 2 - 1
    const rx = -(py * maxTilt)
    const ry = px * maxTilt
    innerRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`
    if (glare) {
      innerRef.current.style.setProperty('--glare-x', `${px}`)
      innerRef.current.style.setProperty('--glare-y', `${py}`)
    }
  }

  const handleLeave = () => {
    if (!innerRef.current) return
    innerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div
      ref={outerRef}
      className={`tilt ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div ref={innerRef} className={`tilt-inner${glare ? ' tilt-glare' : ''}`}>
        {children}
      </div>
    </div>
  )
}

export default Tilt3D