import { useEffect, useState } from 'react'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(typeof window !== 'undefined' ? (window.location.hash || '#home') : '#home')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onHashChange = () => setActive(window.location.hash || '#home')
    const onScroll = () => {
      const doc = document.documentElement
      const scrollTop = doc.scrollTop || document.body.scrollTop
      const scrollHeight = doc.scrollHeight - doc.clientHeight
      const pct = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0
      setProgress(pct)
    }
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <a href="#home" className="brand" aria-label="Go to home">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
            <path d="M4 16c4-8 8-8 12 0" fill="none" stroke="url(#brandGrad)" strokeWidth="3" strokeLinecap="round"/>
            <path d="M6 8c3 2 6 2 9 0" fill="none" stroke="url(#brandGrad)" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
          </svg>
          Cancer Awareness &amp; Support
        </a>
        <button
          className={`nav-toggle ${open ? 'open' : ''}`}
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
        <ul className={`nav-links ${open ? 'open' : ''}`}>
          <li>
            <a href="#home" className={`nav-icon ${active === '#home' ? 'active' : ''}`} aria-label="Home" title="Home" onClick={() => setActive('#home')}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10l9-7 9 7" />
                <path d="M5 10v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10" />
                <path d="M9 22V12h6v10" />
              </svg>
            </a>
          </li>
          <li>
            <a href="#quotes" className={`nav-icon ${active === '#quotes' ? 'active' : ''}`} aria-label="Quotes" title="Quotes" onClick={() => setActive('#quotes')}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
              </svg>
            </a>
          </li>
          <li>
            <a href="#contact" className={`nav-icon ${active === '#contact' ? 'active' : ''}`} aria-label="Contact" title="Contact" onClick={() => setActive('#contact')}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v16H4z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </a>
          </li>
          <li>
            <a href="#login" className={`nav-icon ${active === '#login' ? 'active' : ''}`} aria-label="Login" title="Login" onClick={() => setActive('#login')}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="7" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </a>
          </li>
          <li className="cta"><a href="#donation">Donate</a></li>
        </ul>
      </div>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
    </nav>
  )
}

export default Navbar