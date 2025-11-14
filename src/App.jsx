import { useEffect, useState, useRef } from 'react'
import Navbar from './components/Navbar'
import MedicalBadge from './components/MedicalBadge'
// Removed Tilt3D for a stable, non-animated contact form
import './App.css'

function App() {
  const tiltRef = useRef(null)
  function getGreeting(d) { const h = d.getHours(); if (h < 5) return 'Good night'; if (h < 12) return 'Good morning'; if (h < 17) return 'Good afternoon'; if (h < 21) return 'Good evening'; return 'Good night' }
  // Contact form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  // Quotes state
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [quoteError, setQuoteError] = useState('')
  const [offlineMode, setOfflineMode] = useState(true)
  const [greet, setGreet] = useState(getGreeting(new Date()))
  const [page, setPage] = useState(() => {
    const hash = window.location.hash
    return hash === '#login' ? 'login' : hash === '#signup' ? 'signup' : hash === '#donation' ? 'donation' : 'home'
  })
  const [role, setRole] = useState('user')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupAge, setSignupAge] = useState('')
  const [signupSex, setSignupSex] = useState('')
  const [signupMobile, setSignupMobile] = useState('')
  const [signupAddress, setSignupAddress] = useState('')
  const [signupPhoto, setSignupPhoto] = useState(null)
  const [agreeRules, setAgreeRules] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  // Donate demo state
  const [donateTier, setDonateTier] = useState(25)
  const [donateAmount, setDonateAmount] = useState(25)
  const campaign = { goal: 500000, raised: 312500 }
  const fmtINR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
  const donorsData = [
    { n: 'Alex', age: 34, a: 50, t: '2h' },
    { n: 'Sam', age: 29, a: 25, t: '5h' },
    { n: 'Riya', age: 41, a: 100, t: '1d' },
    { n: 'Liam', age: 22, a: 10, t: '2d' },
    { n: 'Zara', age: 36, a: 75, t: '3d' },
  ]
  const [donationTab, setDonationTab] = useState('overview')
  const goldTheme = true
  const handleDonate = (e) => {
    e.preventDefault()
    const amt = Math.max(5, Math.round(Number(donateAmount) || 0))
    alert(`Thank you for your generosity — demo donation of ₹${amt}.`)
  }

  // Local fallback quotes used when network is unavailable
  const fallbackQuotes = [
    { content: 'Strength does not come from physical capacity. It comes from an indomitable will.', author: 'Mahatma Gandhi' },
    { content: 'You are stronger than you know; more capable than you think.', author: 'Unknown' },
    { content: 'The human spirit is stronger than anything that can happen to it.', author: 'C.C. Scott' },
    { content: 'Hope is being able to see that there is light despite all of the darkness.', author: 'Desmond Tutu' },
    { content: 'Courage is not having the strength to go on; it is going on when you don’t have the strength.', author: 'Napoleon Bonaparte' },
    { content: 'Out of difficulties grow miracles.', author: 'Jean de La Bruyère' },
    { content: 'You have to dream before your dreams can come true.', author: 'A.P.J. Abdul Kalam' },
    { content: 'Give me blood, and I shall give you freedom!', author: 'Subhas Chandra Bose' },
  ]

  // Subtle parallax tilt for hero text (respects reduced motion)
  useEffect(() => {
    const section = document.getElementById('home')
    const node = tiltRef.current
    if (!section || !node) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    let rafId = 0
    const onMove = (e) => {
      const rect = section.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      const rx = y * -3
      const ry = x * 3
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        node.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(rafId)
      node.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
    }
    section.addEventListener('mousemove', onMove)
    section.addEventListener('mouseleave', onLeave)
    return () => {
      section.removeEventListener('mousemove', onMove)
      section.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const validateForm = () => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email'
    if (!message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    // No backend required – simulate submission
    setSubmitted(true)
    // Reset form after brief delay
    setTimeout(() => {
      setName('')
      setEmail('')
      setMessage('')
    }, 300)
  }

  // Helper: fetch JSON with abort timeout; swallow errors and return null
  const fetchJSON = async (url, timeoutMs = 5000) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, { signal: controller.signal })
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    } finally {
      clearTimeout(id)
    }
  }

  const fetchQuote = async () => {
    setLoadingQuote(true)
    setQuoteError('')
    if (offlineMode) {
      const local = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
      if (local) {
        setQuote(local.content)
        setAuthor(local.author)
      }
      setLoadingQuote(false)
      setQuoteError('Using offline quote — network disabled.')
      return
    }

    // Try APIs in sequence; fetchJSON returns null on failure without throwing
    const data1 = await fetchJSON('https://api.quotable.io/random')
    if (data1?.content) {
      setQuote(data1.content)
      setAuthor(data1.author || '')
      setLoadingQuote(false)
      return
    }

    const data2 = await fetchJSON('https://zenquotes.io/api/random')
    const first = Array.isArray(data2) ? data2[0] : null
    if (first?.q) {
      setQuote(first.q)
      setAuthor(first.a || '')
      setLoadingQuote(false)
      return
    }

    const data3 = await fetchJSON('https://type.fit/api/quotes')
    const picked = Array.isArray(data3) ? data3[Math.floor(Math.random() * data3.length)] : null
    if (picked?.text) {
      setQuote(picked.text)
      setAuthor(picked.author || '')
      setLoadingQuote(false)
      return
    }

    // Final local fallback
    const local = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
    if (local) {
      setQuote(local.content)
      setAuthor(local.author)
    }
    setQuoteError('Using offline quote — network unavailable.')
    setLoadingQuote(false)
  }

  useEffect(() => {
    // On first load, show an offline quote to avoid network errors by default
    const local = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)]
    if (local) {
      setQuote(local.content)
      setAuthor(local.author)
    }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setGreet(getGreeting(new Date())), 60000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (offlineMode) return
    fetchQuote()
    const id = setInterval(fetchQuote, 3600000)
    return () => clearInterval(id)
  }, [offlineMode])

  useEffect(() => {
    const updatePage = () => {
      const hash = window.location.hash
      if (hash === '#login') setPage('login')
      else if (hash === '#signup') setPage('signup')
      else if (hash === '#donation') setPage('donation')
      else setPage('home')
    }
    window.addEventListener('hashchange', updatePage)
    updatePage()
    return () => window.removeEventListener('hashchange', updatePage)
  }, [])

  // Toggle a body class to keep background pure white on auth views
  useEffect(() => {
    const body = document.body
    if (page === 'login' || page === 'signup') {
      body.classList.add('auth-mode')
    } else {
      body.classList.remove('auth-mode')
    }
    return () => body.classList.remove('auth-mode')
  }, [page])

  return (
    <>
      {page !== 'login' && page !== 'signup' && page !== 'donation' && <Navbar />}
      <div className="app">
      {page !== 'donation' && (
      <header className="site-header">
        <MedicalBadge size={64} />
        <h1>Cancer Awareness &amp; Support</h1>
        <p className="tagline">Information, encouragement, and a listening ear.</p>
      </header>
      )}

      <main>
        {page === 'login' ? (
          // Login-only view
          <section key="login" className="login-page" id="login" aria-label="Login">
            <div className="login-inner">
              <h3>Login</h3>
              <div className="login-card depth-card">
                <form onSubmit={(e) => { e.preventDefault(); alert('Logged in (demo).') }} noValidate>
                  <fieldset className="role-select">
                    <legend>Role</legend>
                    <label>
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={role === 'user'}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      User
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="role"
                        value="donation"
                        checked={role === 'donation'}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      Donation
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={role === 'admin'}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      Admin
                    </label>
                  </fieldset>
                  <div className="form-grid">
                    <label>
                      Email
                      <input type="email" placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} autoComplete="email" />
                    </label>
                    <label>
                      Password
                      <input type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} autoComplete="current-password" />
                    </label>
                  </div>
                  <button className="primary" type="submit">{`Log In (${role === 'donation' ? 'Donation' : role.charAt(0).toUpperCase() + role.slice(1)})`}</button>
                </form>
              </div>
              <p className="login-hint">
                {role === 'admin'
                  ? 'Admin accounts are provisioned by staff. Please use existing credentials.'
                  : 'Create an account to log in as User or Donation.'}
              </p>
              <div className="login-actions">
                {role !== 'admin' && (
                  <button className="secondary" onClick={(e) => { e.preventDefault(); window.location.hash = '#signup' }}>
                    Create Account
                  </button>
                )}
              </div>
            </div>
          </section>
        ) : page === 'signup' ? (
          <section key="signup" className="login-page signup-page" id="signup" aria-label="Create Account">
            <div className="login-inner">
              <h3>Create Account</h3>
              <div className="login-card depth-card">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    // Common password confirmation for both roles
                    if (signupPassword !== signupPasswordConfirm) {
                      alert('Passwords do not match.')
                      return
                    }
                    // Require agreeing to rules for Donation role
                    if (role === 'donation' && !agreeRules) {
                      alert('Please agree to the rules below to continue.')
                      return
                    }
                    alert(`Account created (demo) for ${role}.`)
                  }}
                  noValidate
                >
                  <fieldset className="role-select">
                    <legend>Role</legend>
                    <label>
                      <input type="radio" name="signup-role" value="user" checked={role === 'user'} onChange={(e) => setRole(e.target.value)} />
                      User
                    </label>
                    <label>
                      <input type="radio" name="signup-role" value="donation" checked={role === 'donation'} onChange={(e) => setRole(e.target.value)} />
                      Donation
                    </label>
                    {/* Admin role removed on signup page */}
                  </fieldset>
                  {role === 'user' ? (
                    <div className="form-grid">
                      <label>
                        Full Name
                        <input type="text" placeholder="Your full name" value={signupName} onChange={(e) => setSignupName(e.target.value)} autoComplete="name" />
                      </label>
                      <label>
                        Age
                        <input type="number" placeholder="Your age" value={signupAge} onChange={(e) => setSignupAge(e.target.value)} min="0" />
                      </label>
                      <div>
                        <fieldset className="sex-select">
                          <legend>Sex</legend>
                          <label>
                            <input type="radio" name="signup-sex" value="Male" checked={signupSex === 'Male'} onChange={(e) => setSignupSex(e.target.value)} />
                            Male
                          </label>
                          <label>
                            <input type="radio" name="signup-sex" value="Female" checked={signupSex === 'Female'} onChange={(e) => setSignupSex(e.target.value)} />
                            Female
                          </label>
                          <label>
                            <input type="radio" name="signup-sex" value="Other" checked={signupSex === 'Other'} onChange={(e) => setSignupSex(e.target.value)} />
                            Other
                          </label>
                        </fieldset>
                      </div>
                      <label>
                        Email
                        <input type="email" placeholder="you@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} autoComplete="email" />
                      </label>
                      <label>
                        Mobile Num
                        <input type="tel" placeholder="e.g., +1 555 123 4567" value={signupMobile} onChange={(e) => setSignupMobile(e.target.value)} autoComplete="tel" />
                      </label>
                      <label className="full">
                        Address
                        <input type="text" placeholder="Street, City, State" value={signupAddress} onChange={(e) => setSignupAddress(e.target.value)} autoComplete="street-address" />
                      </label>
                      <label className="full">
                        Profile Photo
                        <input type="file" accept="image/*" onChange={(e) => setSignupPhoto(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
                        {signupPhoto && <small className="hint">Selected: {signupPhoto.name || 'Photo'}</small>}
                      </label>
                      <label>
                        Password
                        <input type="password" placeholder="Choose a password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} autoComplete="new-password" />
                      </label>
                      <label>
                        Confirm Password
                        <input type="password" placeholder="Re-enter password" value={signupPasswordConfirm} onChange={(e) => setSignupPasswordConfirm(e.target.value)} autoComplete="new-password" />
                      </label>
                    </div>
                  ) : (
                    <>
                      <div className="form-grid">
                        <label>
                          Full Name
                          <input type="text" placeholder="Your full name" value={signupName} onChange={(e) => setSignupName(e.target.value)} autoComplete="name" />
                        </label>
                        <label>
                          Age
                          <input type="number" placeholder="Your age" value={signupAge} onChange={(e) => setSignupAge(e.target.value)} min="0" />
                        </label>
                        <div>
                          <fieldset className="sex-select">
                            <legend>Sex</legend>
                            <label>
                              <input type="radio" name="signup-sex" value="Male" checked={signupSex === 'Male'} onChange={(e) => setSignupSex(e.target.value)} />
                              Male
                            </label>
                            <label>
                              <input type="radio" name="signup-sex" value="Female" checked={signupSex === 'Female'} onChange={(e) => setSignupSex(e.target.value)} />
                              Female
                            </label>
                            <label>
                              <input type="radio" name="signup-sex" value="Other" checked={signupSex === 'Other'} onChange={(e) => setSignupSex(e.target.value)} />
                              Other
                            </label>
                          </fieldset>
                        </div>
                        <label>
                          Email
                          <input type="email" placeholder="you@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} autoComplete="email" />
                        </label>
                        <label>
                          Mobile Num
                          <input type="tel" placeholder="e.g., +1 555 123 4567" value={signupMobile} onChange={(e) => setSignupMobile(e.target.value)} autoComplete="tel" />
                        </label>
                        <label className="full">
                          Address
                          <input type="text" placeholder="Street, City, State" value={signupAddress} onChange={(e) => setSignupAddress(e.target.value)} autoComplete="street-address" />
                        </label>
                        <label className="full">
                          Profile Photo
                          <input type="file" accept="image/*" onChange={(e) => setSignupPhoto(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
                        </label>
                        <label>
                          Password
                          <input type="password" placeholder="Choose a password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} autoComplete="new-password" />
                        </label>
                        <label>
                          Confirm Password
                          <input type="password" placeholder="Re-enter password" value={signupPasswordConfirm} onChange={(e) => setSignupPasswordConfirm(e.target.value)} autoComplete="new-password" />
                        </label>
                      </div>
                      <label className="full" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '0.5rem' }}>
                        <input type="checkbox" aria-label="Agree to the rules" title="Agree to the rules" checked={agreeRules} onChange={(e) => setAgreeRules(e.target.checked)} />
                      </label>
                    </>
                  )}
                  <button className="primary" type="submit">Create {role === 'donation' ? 'Donation' : role.charAt(0).toUpperCase() + role.slice(1)} Account</button>
                </form>
              </div>
              <p className="login-hint">
                {role === 'admin' ? 'Admins cannot self-register; accounts are provisioned by staff.' : 'After creating an account, return to Login to sign in.'}
              </p>
              <div className="login-actions">
                <button className="secondary" onClick={(e) => { e.preventDefault(); window.location.hash = '#login' }}>Back to Login</button>
              </div>
            </div>
          </section>
        ) : page === 'donation' ? (
          <>
            <section className="section-card donate-section depth-card" id="donation" aria-label="Donation Dashboard">
              <div className="dashboard-bg" aria-hidden="true" />
              <div className="dashboard-layout">
                <aside className="dashboard-sidebar">
                  <div className="sidebar-brand">Donations</div>
                  <nav className="sidebar-nav">
                    <a href="#donation" className={`sidebar-link ${donationTab === 'overview' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setDonationTab('overview') }}>Overview</a>
                    <a href="#donation" className={`sidebar-link ${donationTab === 'donations' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setDonationTab('donations') }}>Donations</a>
                    <a href="#donation" className={`sidebar-link ${donationTab === 'donors' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setDonationTab('donors') }}>Donors</a>
                    <a href="#donation" className={`sidebar-link ${donationTab === 'settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setDonationTab('settings') }}>Settings</a>
                  </nav>
                </aside>
                <div className={`dashboard-main ${goldTheme ? 'gold-theme' : ''}`}>
              <div className="dashboard-topbar">
                <h3>Donation Dashboard</h3>
                <p className="donate-intro">Track progress and make a secure contribution.</p>
              </div>
              {donationTab === 'overview' && (
              <>
              <div className="donate-grid">
                <form className="donate-card" onSubmit={handleDonate} noValidate>
                  <div className="donate-progress">
                    <div className="bar">
                      <div className="fill" style={{ '--progress': `${Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))}%` }} />
                      <div className="shimmer" aria-hidden="true" />
                    </div>
                    <div className="numbers">
                      Raised {fmtINR.format(campaign.raised)} of {fmtINR.format(campaign.goal)} goal
                    </div>
                  </div>
                  <div className="tiers" role="group" aria-label="Quick amounts">
                    {[100, 250, 500, 1000].map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`tier-btn ${donateTier === t ? 'active' : ''}`}
                        onClick={() => { setDonateTier(t); setDonateAmount(t); }}
                      >
                        ₹{t}
                      </button>
                    ))}
                    <button type="button" className={`tier-btn ${donateTier === -1 ? 'active' : ''}`}
                      onClick={() => { setDonateTier(-1); setTimeout(() => { const el = document.getElementById('donate-amount'); el && el.focus(); }, 0) }}>
                      Custom
                    </button>
                  </div>
                  <label className="amount-input">
                    <span>Amount (INR)</span>
                    <input id="donate-amount" type="number" min="5" value={donateAmount} onChange={(e) => setDonateAmount(e.target.value)} placeholder="250" />
                  </label>
                  <button className="donate-now btn-sheen" type="submit">
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.1 21.3l-1.4-1.3C5.8 15.7 2 12.2 2 8.2 2 5.5 4.2 3.3 6.9 3.3c1.7 0 3.3.8 4.2 2.1.9-1.3 2.5-2.1 4.2-2.1 2.7 0 4.9 2.2 4.9 4.9 0 4-3.8 7.5-8.7 11.8l-1.4 1.3z"/></svg>
                    <span>Donate Now</span>
                  </button>
                </form>
                <ul className="impact-list" aria-label="Your impact">
                  <li className="impact-chip float-slow" style={{ '--d': 0 }}>Counseling session for a patient</li>
                  <li className="impact-chip float-slow" style={{ '--d': 1 }}>Transport support to chemotherapy</li>
                  <li className="impact-chip float-slow" style={{ '--d': 2 }}>Care package for recovery</li>
                </ul>
              </div>
              <div className="kpi-grid">
                {(() => {
                  const donorCount = donorsData.length
                  const totalAge = donorsData.reduce((s, d) => s + d.age, 0)
                  const totalDonations = donorsData.reduce((s, d) => s + d.a, 0)
                  const pct = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))
                  return (
                    <>
                      <div className="kpi-card"><div className="kpi-value">{fmtINR.format(totalDonations)}</div><div className="kpi-label">Total Donations</div></div>
                      <div className="kpi-card"><div className="kpi-value">{donorCount}</div><div className="kpi-label">Donors</div></div>
                      <div className="kpi-card"><div className="kpi-value">{totalAge}</div><div className="kpi-label">Total Ages</div></div>
                      <div className="kpi-card"><div className="kpi-value">{pct}%</div><div className="kpi-label">Progress</div></div>
                    </>
                  )
                })()}
              </div>
              <div className="panels-grid">
                <div className="panel">
                  <div className="panel-title">Recent Donations</div>
                  <ul className="recent-list">
                    {donorsData.map((d, i) => (
                      <li key={i} className="recent-item"><span>{d.n}</span><span className="meta">{fmtINR.format(d.a)} • {d.t}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="panel">
                  <div className="panel-title">Top Donors</div>
                  <ul className="donor-list">
                    {[
                      { n: 'Grace', a: 500 },
                      { n: 'Noah', a: 300 },
                      { n: 'Mia', a: 250 },
                    ].map((d, i) => (
                      <li key={i} className="donor-item"><span>{d.n}</span><span className="meta">{fmtINR.format(d.a)}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
              </>
              )}
              {donationTab === 'donations' && (
                <div className="panel">
                  <div className="panel-title">All Donations</div>
                  <table className="table">
                    <thead>
                      <tr><th>Donor</th><th>Amount</th><th>When</th></tr>
                    </thead>
                    <tbody>
                      {donorsData.map((d, i) => (
                        <tr key={i}><td>{d.n}</td><td>{fmtINR.format(d.a)}</td><td>{d.t}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {donationTab === 'donors' && (
                <div className="panel">
                  <div className="panel-title">Donors</div>
                  <div className="kpi-grid" style={{ marginTop: 0 }}>
                    {(() => {
                      const donorCount = donorsData.length
                      const totalAge = donorsData.reduce((s, d) => s + d.age, 0)
                      const totalDonations = donorsData.reduce((s, d) => s + d.a, 0)
                      return (
                        <>
                          <div className="kpi-card"><div className="kpi-value">{donorCount}</div><div className="kpi-label">Total Donors</div></div>
                          <div className="kpi-card"><div className="kpi-value">{fmtINR.format(totalDonations)}</div><div className="kpi-label">Total Donations</div></div>
                          <div className="kpi-card"><div className="kpi-value">{totalAge}</div><div className="kpi-label">Total Ages</div></div>
                          <div className="kpi-card"><div className="kpi-value">{Math.round(totalAge / donorCount)}</div><div className="kpi-label">Avg Age</div></div>
                        </>
                      )
                    })()}
                  </div>
                  <ul className="donor-list" style={{ marginTop: '.75rem' }}>
                    {donorsData.map((d, i) => (
                      <li key={i} className="donor-item"><span>{d.n} • {d.age}</span><span className="meta">{fmtINR.format(d.a)}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {donationTab === 'settings' && (
                <div className="panel">
                  <div className="panel-title">Settings</div>
                  <div className="settings-grid">
                    <div className="setting-row"><span>Contact Admin</span><a className="card-link" href="#contact">Contact</a></div>
                    <div className="setting-row"><span>Support</span><a className="card-link" href="#community">Get Help</a></div>
                  </div>
                </div>
              )}
              <div style={{ marginTop: '0.75rem' }}>
                <a className="card-link" href="#home">Back to Home</a>
              </div>
              </div>
              </div>
            </section>

            <section className="section-card med-section depth-card" id="doctor-dashboard" aria-label="Clinical overview">
              <h3>Clinical Overview</h3>
              <p>Key operational metrics and quick actions for a medical dashboard.</p>
              <div className="kpi-grid">
                {(() => {
                  const patients = 48
                  const todayAppts = 12
                  const pendingLabs = 7
                  const unread = 5
                  return (
                    <>
                      <div className="kpi-card"><div className="kpi-value">{patients}</div><div className="kpi-label">Patients Under Care</div></div>
                      <div className="kpi-card"><div className="kpi-value">{todayAppts}</div><div className="kpi-label">Appointments Today</div></div>
                      <div className="kpi-card"><div className="kpi-value">{pendingLabs}</div><div className="kpi-label">Labs Pending</div></div>
                      <div className="kpi-card"><div className="kpi-value">{unread}</div><div className="kpi-label">Messages</div></div>
                    </>
                  )
                })()}
              </div>
              <div className="panels-grid" style={{ marginTop: '.8rem' }}>
                <div className="panel">
                  <div className="panel-title">Today’s Appointments</div>
                  <table className="table">
                    <thead>
                      <tr><th>Patient</th><th>Time</th><th>Type</th></tr>
                    </thead>
                    <tbody>
                      {[
                        { n: 'Anaya', t: '09:30', y: 'Consultation' },
                        { n: 'Rahul', t: '10:15', y: 'Follow-up' },
                        { n: 'Priya', t: '11:00', y: 'Lab Review' },
                        { n: 'Karan', t: '12:30', y: 'Treatment' },
                      ].map((r, i) => (
                        <tr key={i}><td>{r.n}</td><td>{r.t}</td><td>{r.y}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="panel">
                  <div className="panel-title">Quick Actions</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem' }}>
                    <a className="card-link" href="#patients">Patients</a>
                    <a className="card-link" href="#appointments">Appointments</a>
                    <a className="card-link" href="#labs">Lab Results</a>
                    <a className="card-link" href="#messages">Messages</a>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Landing / Hero */}
            <section className="hero" id="home" aria-label="Landing banner">
              <div className="hero-quote" role="status" aria-live="polite">
                <div className="hq-left">
                  <span className="quote-label">
                    <svg className="ql-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M7 9c0-1.657 1.343-3 3-3h1v3H9c0 2.209-1.791 4-4 4v-2c1.105 0 2-0.895 2-2zm8 0c0-1.657 1.343-3 3-3h1v3h-2c0 2.209-1.791 4-4 4v-2c1.105 0 2-0.895 2-2z"/></svg>
                    Daily Inspiration
                  </span>
                  <span className="greet-chip">{greet}</span>
                  <span className="quote-content">{quote}</span>
                  {author && <span className="quote-author">— {author}</span>}
                </div>
                <button className="quote-refresh" onClick={fetchQuote} aria-label="Refresh quote">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 6V3L8 7l4 4V8c2.757 0 5 2.243 5 5a5 5 0 1 1-5-5z"/></svg>
                </button>
              </div>
              <div className="hero-accent" aria-hidden="true" />
              {/* Awareness & Support banner with medical and cancer design cues */}
              <div className="awareness-banner" aria-label="Cancer awareness and support banner">
                <div className="banner-badges">
                  <span className="badge">
                    <span className="icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#0ea5e9"/><path d="M11 6h2v12h-2zM6 11h12v2H6z" fill="#fff"/></svg>
                    </span>
                    <span className="label">Medical Care</span>
                  </span>
                  <span className="badge">
                    <span className="icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c5 0 9 4 9 9s-8 9-9 9-9-4-9-9 4-9 9-9z" fill="#f472b6"/><path d="M8 12c2-4 6-4 8 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
                    </span>
                    <span className="label">Awareness Ribbon</span>
                  </span>
                  <span className="badge">
                    <span className="icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.5-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-7 10-7 10l-2-1.2z" fill="#22d3ee"/></svg>
                    </span>
                    <span className="label">Support</span>
                  </span>
                  <span className="badge">
                    <span className="icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z" fill="#60a5fa"/><path d="M6 7h12v10H6z" fill="#fff"/></svg>
                    </span>
                    <span className="label">Knowledge</span>
                  </span>
                </div>
                <ul className="issue-chips" aria-label="Key cancer-related focus areas">
                  <li><span className="chip"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L6.5 20l2-7L3 9h7z" fill="#0ea5e9"/></svg>Early Detection</span></li>
                  <li><span className="chip"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h10l6 6v10H4z" fill="#14b8a6"/></svg>Care Access</span></li>
                  <li><span className="chip"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="#f472b6"/><path d="M2 12h4M18 12h4M12 2v4M12 18v4" stroke="#f472b6" strokeWidth="2"/></svg>Mental Health</span></li>
                  <li><span className="chip"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 22h2v-3h6v3h2v-3h2v-2h-2v-3h-2v-3h2V9h-2V6h-2V3h-2v3H9v3H7v2h2v3H7v3H5v2h2v3z" fill="#60a5fa"/></svg>Research</span></li>
                </ul>
              </div>
              <div className="hero-text tilt-wrap" ref={tiltRef}>
                <h2 className="hero-head" aria-label="Together, we make a difference">
                  <span aria-hidden="true">
                    {"Together, we make a difference".split("").map((ch, i) => (
                      <span className="char" style={{ "--i": i }} key={i}>
                        {ch === " " ? "\u00A0" : ch}
                      </span>
                    ))}
                  </span>
                </h2>
                <div className="hero-underline" aria-hidden="true"></div>
                <p className="hero-sub">
                  Explore resources, share stories, and find support. Awareness saves lives—
                  let’s learn, act, and uplift each other.
                </p>
                <div className="hero-actions">
                  <a href="#donation" role="button" className="cta-box cta-donate btn-sheen">
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.1 21.3l-1.4-1.3C5.8 15.7 2 12.2 2 8.2 2 5.5 4.2 3.3 6.9 3.3c1.7 0 3.3.8 4.2 2.1.9-1.3 2.5-2.1 4.2-2.1 2.7 0 4.9 2.2 4.9 4.9 0 4-3.8 7.5-8.7 11.8l-1.4 1.3z"/></svg>
                    <span>Donate</span>
                  </a>
                  <a href="#learn" role="button" className="cta-box cta-learn btn-sheen">
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5h16v14H4zM6 7h12v10H6z"/></svg>
                    <span>Learn More</span>
                  </a>
                  <a href="#community" role="button" className="cta-box cta-community btn-sheen">
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16v12H7l-3 3z"/></svg>
                    <span>Join Community</span>
                  </a>
                </div>
                <ul className="hero-features" aria-label="Key areas">
                  <li>
                    <a href="#awareness" className="feature-chip float-slow" style={{ '--d': 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2c3 0 5 2 5 5 0 4-5 8-5 8S7 11 7 7c0-3 2-5 5-5z"/></svg>
                      <span>Awareness</span>
                    </a>
                  </li>
                  <li>
                    <a href="#support" className="feature-chip float-slow" style={{ '--d': 1 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10l-2-1.2z"/></svg>
                      <span>Support</span>
                    </a>
                  </li>
                  <li>
                    <a href="#research" className="feature-chip float-slow" style={{ '--d': 2 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 22h2v-3h6v3h2v-3h2v-2h-2v-3h-2v-3h2V9h-2V6h-2V3h-2v3H9v3H7v2h2v3H7v3H5v2h2v3z"/></svg>
                      <span>Research</span>
                    </a>
                  </li>
                  <li>
                    <a href="#events" className="feature-chip float-slow" style={{ '--d': 3 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h10a2 2 0 0 1 2 2v16l-4-3-4 3-4-3-4 3V4a2 2 0 0 1 2-2z"/></svg>
                      <span>Events</span>
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            {/* Target Sections */}
            <section className="section-card donate-section depth-card" id="donate" aria-label="Donate">
              <h3>Donate</h3>
              <p className="donate-intro">Fuel life-saving programs and patient support. Your gift matters.</p>
              <div className="donate-grid">
                <form className="donate-card" onSubmit={handleDonate} noValidate>
                  <div className="donate-progress">
                    <div className="bar">
                      <div className="fill" style={{ '--progress': `${Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))}%` }} />
                      <div className="shimmer" aria-hidden="true" />
                    </div>
                    <div className="numbers">
                      Raised {fmtINR.format(campaign.raised)} of {fmtINR.format(campaign.goal)} goal
                    </div>
                  </div>
                  <div className="tiers" role="group" aria-label="Quick amounts">
                    {[100, 250, 500, 1000].map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`tier-btn ${donateTier === t ? 'active' : ''}`}
                        onClick={() => { setDonateTier(t); setDonateAmount(t); }}
                      >
                        ₹{t}
                      </button>
                    ))}
                    <button type="button" className={`tier-btn ${donateTier === -1 ? 'active' : ''}`}
                      onClick={() => { setDonateTier(-1); setTimeout(() => { const el = document.getElementById('donate-amount'); el && el.focus(); }, 0) }}>
                      Custom
                    </button>
                  </div>
                  <label className="amount-input">
                    <span>Amount (INR)</span>
                    <input id="donate-amount" type="number" min="5" value={donateAmount} onChange={(e) => setDonateAmount(e.target.value)} placeholder="250" />
                  </label>
                  <button className="donate-now btn-sheen" type="submit">
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.1 21.3l-1.4-1.3C5.8 15.7 2 12.2 2 8.2 2 5.5 4.2 3.3 6.9 3.3c1.7 0 3.3.8 4.2 2.1.9-1.3 2.5-2.1 4.2-2.1 2.7 0 4.9 2.2 4.9 4.9 0 4-3.8 7.5-8.7 11.8l-1.4 1.3z"/></svg>
                    <span>Donate Now</span>
                  </button>
                </form>
                <ul className="impact-list" aria-label="Your impact">
                  <li className="impact-chip float-slow" style={{ '--d': 0 }}>Counseling session for a patient</li>
                  <li className="impact-chip float-slow" style={{ '--d': 1 }}>Transport support to chemotherapy</li>
                  <li className="impact-chip float-slow" style={{ '--d': 2 }}>Care package for recovery</li>
                </ul>
              </div>
            </section>
            <section className="section-card learn-section depth-card" id="learn" aria-label="Landmark & Learn More">
              <h3>Learn More</h3>
              <p className="learn-intro">Discover landmark studies, news, care guides, and ways to take action.</p>
              <div className="learn-grid">
                <article className="learn-card lc-landmark">
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l9 4-9 4-9-4 9-4zm0 6l9 4-9 4-9-4 9-4zm0 6l9 4-9 4-9-4 9-4z"/></svg>
                    <h4>Landmark Studies</h4>
                  </div>
                  <p>Breakthroughs and trials shaping the fight against cancer.</p>
                  <div className="badges">
                    <span className="badge">Clinical</span>
                    <span className="badge">Genomics</span>
                    <span className="badge">Immunotherapy</span>
                  </div>
                  <a className="card-link" href="#learn">Explore</a>
                </article>

                <article className="learn-card lc-news">
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5h16v14H4zM6 7h12v2H6zm0 4h12v6H6z"/></svg>
                    <h4>News & Updates</h4>
                  </div>
                  <p>The latest stories, campaigns, and community highlights.</p>
                  <div className="badges">
                    <span className="badge">Campaigns</span>
                    <span className="badge">Community</span>
                  </div>
                  <a className="card-link" href="#learn">Read</a>
                </article>

                <article className="learn-card lc-guides">
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 2h9l5 5v15H6zM8 6h8v2H8zm0 4h8v2H8zm0 4h8v2H8z"/></svg>
                    <h4>Care Guides</h4>
                  </div>
                  <p>Practical tips for patients, caregivers, and supporters.</p>
                  <div className="badges">
                    <span className="badge">Support</span>
                    <span className="badge">Wellbeing</span>
                  </div>
                  <a className="card-link" href="#learn">View</a>
                </article>

                <article className="learn-card lc-faq">
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2zm1 15h-2v-2h2zm1.07-7.75l-.9.92A3.49 3.49 0 0 0 12 13h-2v-.5a4.5 4.5 0 0 1 1.33-3.22l1.24-1.26A1.75 1.75 0 1 0 9.75 5.5H8a3.25 3.25 0 1 1 6.12 1.75z"/></svg>
                    <h4>FAQs</h4>
                  </div>
                  <p>Answers to common questions and how to get help fast.</p>
                  <div className="badges">
                    <span className="badge">Basics</span>
                    <span className="badge">Get Help</span>
                  </div>
                  <a className="card-link" href="#learn">Browse</a>
                </article>
              </div>
            </section>
            <section className="section-card community-section depth-card" id="community" aria-label="Join Community">
              <h3>Join Community</h3>
              <p className="community-intro">Connect with others, share journeys, and uplift together.</p>
              <div className="community-grid">
                <article className="community-card cc-join animate-in">
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm-7 8v-1a6 6 0 0 1 12 0v1z"/></svg>
                    <h4>Become a Member</h4>
                  </div>
                  <p>Get access to stories, mentorship, events, and resources.</p>
                  <div className="benefits" aria-label="Benefits">
                    {['Stories','Mentorship','Events','Resources'].map((b,i)=> (
                      <span className="benefit-chip float-slow" style={{'--d': i}} key={b}>{b}</span>
                    ))}
                  </div>
                  <a className="card-link join-now" href="#signup">Join Now</a>
                </article>

                <article className="community-card cc-event animate-in" style={{'--i':1}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 3h10v2H7zM4 7h16v14H4zM6 9h12v10H6z"/></svg>
                    <h4>Community Fair</h4>
                  </div>
                  <p>Meet local groups, explore booths, and join activities.</p>
                  <div className="event-meta"><span>Sat • 10:00</span><span>City Park</span></div>
                  <a className="card-link" href="#contact">RSVP</a>
                </article>

                <article className="community-card cc-circle animate-in" style={{'--i':2}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
                    <h4>Support Circle</h4>
                  </div>
                  <p>Weekly small group sharing and encouragement.</p>
                  <div className="event-meta"><span>Wed • 18:30</span><span>Community Center</span></div>
                  <a className="card-link" href="#contact">Join</a>
                </article>

                <article className="community-card cc-walk animate-in" style={{'--i':3}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 5a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm-5 12l3-4 2 1 2 5H9z"/></svg>
                    <h4>Awareness Walk</h4>
                  </div>
                  <p>Step out together to raise awareness and hope.</p>
                  <div className="event-meta"><span>Sun • 08:00</span><span>Riverside</span></div>
                  <a className="card-link" href="#contact">Volunteer</a>
                </article>
              </div>
            </section>
            <section className="section-card awareness-section depth-card" id="awareness" aria-label="Awareness">
              <h3>Awareness</h3>
              <p className="aware-intro">Campaigns, stories, and tools to spread awareness.</p>
              <div className="aware-grid">
                <article className="aware-card ac-campaign animate-in" style={{'--i':0}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 4h18v4H3zm2 6h14v10H5z"/></svg>
                    <h4>Campaigns</h4>
                  </div>
                  <p>Join national and local campaigns to spread awareness.</p>
                  <div className="badges">
                    <span className="badge">Posters</span>
                    <span className="badge">Ribbons</span>
                    <span className="badge">Social</span>
                  </div>
                  <a className="card-link" href="#events">Participate</a>
                </article>

                <article className="aware-card ac-stories animate-in" style={{'--i':1}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 6h16v12H4zM6 8h12v8H6z"/></svg>
                    <h4>Stories</h4>
                  </div>
                  <p>Real journeys of hope from survivors and caregivers.</p>
                  <div className="badges">
                    <span className="badge">Hope</span>
                    <span className="badge">Survivor</span>
                    <span className="badge">Caregiver</span>
                  </div>
                  <a className="card-link" href="#learn">Read</a>
                </article>

                <article className="aware-card ac-toolkit animate-in" style={{'--i':2}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 2h9l5 5v15H6zM8 6h8v2H8zm0 4h8v2H8zm0 4h8v2H8z"/></svg>
                    <h4>Toolkits</h4>
                  </div>
                  <p>Shareable resources: downloads, templates, and guides.</p>
                  <div className="badges">
                    <span className="badge">Downloads</span>
                    <span className="badge">Templates</span>
                    <span className="badge">Guides</span>
                  </div>
                  <a className="card-link" href="#learn">Get Toolkit</a>
                </article>

                <article className="aware-card ac-actions animate-in" style={{'--i':3}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2zm1 15h-2v-2h2zm1-4h-4V7h2v4h2z"/></svg>
                    <h4>Take Action</h4>
                  </div>
                  <p>Host events, fundraise, or volunteer to amplify impact.</p>
                  <div className="badges">
                    <span className="badge">Host</span>
                    <span className="badge">Fundraise</span>
                    <span className="badge">Volunteer</span>
                  </div>
                  <a className="card-link" href="#contact">Start</a>
                </article>
              </div>
            </section>

            <section className="section-card support-section depth-card" id="support" aria-label="Support">
              <h3>Support</h3>
              <p className="support-intro">Guides, helplines, and community-led support resources.</p>
              <div className="support-grid">
                <article className="support-card sc-helpline animate-in" style={{'--i':0}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.06-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A16 16 0 0 1 3 8a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.24 1.06z"/></svg>
                    <h4>Helplines</h4>
                  </div>
                  <p>Connect with trained counselors and support services.</p>
                  <ul className="helpline-list" aria-label="Helplines">
                    <li><span>National Cancer Helpline</span> <a href="#contact" className="card-link">Call</a></li>
                    <li><span>Caregiver Hotline</span> <a href="#contact" className="card-link">Call</a></li>
                    <li><span>Treatment Navigator</span> <a href="#contact" className="card-link">Call</a></li>
                  </ul>
                </article>

                <article className="support-card sc-guides animate-in" style={{'--i':1}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 2h9l5 5v15H6zM8 6h8v2H8zm0 4h8v2H8zm0 4h8v2H8z"/></svg>
                    <h4>Care Guides</h4>
                  </div>
                  <p>Practical support guides for nutrition, mental health, recovery.</p>
                  <div className="badges">
                    <span className="badge">Nutrition</span>
                    <span className="badge">Mental Health</span>
                    <span className="badge">Post-treatment</span>
                  </div>
                  <a className="card-link" href="#learn">View Guides</a>
                </article>

                <article className="support-card sc-local animate-in" style={{'--i':2}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm-7 8v-1a6 6 0 0 1 12 0v1z"/></svg>
                    <h4>Local Groups</h4>
                  </div>
                  <p>Find in-person and online circles to share and be heard.</p>
                  <div className="badges">
                    <span className="badge">City</span>
                    <span className="badge">Online</span>
                    <span className="badge">Youth</span>
                  </div>
                  <a className="card-link" href="#community">Find Group</a>
                </article>

                <article className="support-card sc-financial animate-in" style={{'--i':3}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2zm1 15h-2v-2h2zm1-4h-4V7h2v4h2z"/></svg>
                    <h4>Financial Aid</h4>
                  </div>
                  <p>Explore grants and assistance for treatment and travel.</p>
                  <div className="badges">
                    <span className="badge">Travel</span>
                    <span className="badge">Medicine</span>
                    <span className="badge">Care</span>
                  </div>
                  <a className="card-link" href="#contact">Request Help</a>
                </article>
              </div>
            </section>
            <section className="section-card research-section depth-card" id="research" aria-label="Research">
              <h3>Research</h3>
              <p className="research-intro">Breakthroughs, trials, and ways to contribute to research.</p>
              <div className="research-grid">
                <article className="research-card rc-breakthrough animate-in" style={{'--i':0}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l9 4-9 4-9-4 9-4zm0 6l9 4-9 4-9-4 9-4z"/></svg>
                    <h4>Breakthroughs</h4>
                  </div>
                  <p>Latest discoveries shaping oncology: genomics, immunotherapy, precision medicine.</p>
                  <div className="badges">
                    <span className="badge">Genomics</span>
                    <span className="badge">Immunotherapy</span>
                    <span className="badge">Precision</span>
                  </div>
                  <a className="card-link" href="#learn">Explore</a>
                </article>

                <article className="research-card rc-trials animate-in" style={{'--i':1}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5h16v14H4zM6 7h12v10H6z"/></svg>
                    <h4>Clinical Trials</h4>
                  </div>
                  <p>Find trials, eligibility, and guidance to participate safely.</p>
                  <div className="badges">
                    <span className="badge">Phase I</span>
                    <span className="badge">Phase II</span>
                    <span className="badge">Phase III</span>
                  </div>
                  <a className="card-link" href="#learn">Find Trials</a>
                </article>

                <article className="research-card rc-contribute animate-in" style={{'--i':2}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.1 21.3l-1.4-1.3C5.8 15.7 2 12.2 2 8.2 2 5.5 4.2 3.3 6.9 3.3c1.7 0 3.3.8 4.2 2.1.9-1.3 2.5-2.1 4.2-2.1 2.7 0 4.9 2.2 4.9 4.9 0 4-3.8 7.5-8.7 11.8l-1.4 1.3z"/></svg>
                    <h4>Contribute</h4>
                  </div>
                  <p>Fuel research with donations, data sharing, or participation.</p>
                  <div className="badges">
                    <span className="badge">Donate</span>
                    <span className="badge">Data</span>
                    <span className="badge">Participate</span>
                  </div>
                  <a className="card-link" href="#donate">Support</a>
                </article>

                <article className="research-card rc-publications animate-in" style={{'--i':3}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 2h9l5 5v15H6zM8 6h8v2H8zm0 4h8v2H8zm0 4h8v2H8z"/></svg>
                    <h4>Publications</h4>
                  </div>
                  <p>Peer‑reviewed papers, reviews, and curated reading lists.</p>
                  <div className="badges">
                    <span className="badge">Papers</span>
                    <span className="badge">Reviews</span>
                  </div>
                  <a className="card-link" href="#learn">Browse</a>
                </article>
              </div>
            </section>

            <section className="section-card events-section depth-card" id="events" aria-label="Events">
              <h3>Events</h3>
              <p className="events-intro">Upcoming events and opportunities to participate.</p>
              <div className="events-grid">
                <article className="events-card ev-upcoming animate-in" style={{'--i':0}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 3h10v2H7zM4 7h16v14H4zM6 9h12v10H6z"/></svg>
                    <h4>Upcoming</h4>
                  </div>
                  <p>What’s next in your area and online.</p>
                  <ul className="events-list" aria-label="Upcoming events">
                    <li><span>Awareness Walk</span> <a className="card-link" href="#contact">Details</a></li>
                    <li><span>Care Workshop</span> <a className="card-link" href="#contact">Details</a></li>
                    <li><span>Research Webinar</span> <a className="card-link" href="#contact">Details</a></li>
                  </ul>
                </article>

                <article className="events-card ev-workshops animate-in" style={{'--i':1}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
                    <h4>Workshops</h4>
                  </div>
                  <p>Hands‑on sessions to learn skills and share knowledge.</p>
                  <div className="badges">
                    <span className="badge">Care</span>
                    <span className="badge">Nutrition</span>
                    <span className="badge">Mindfulness</span>
                  </div>
                  <a className="card-link" href="#contact">Register</a>
                </article>

                <article className="events-card ev-webinars animate-in" style={{'--i':2}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5h16v14H4zM6 7h12v2H6zm0 4h12v6H6z"/></svg>
                    <h4>Webinars</h4>
                  </div>
                  <p>Expert talks and Q&A you can join from anywhere.</p>
                  <div className="badges">
                    <span className="badge">Online</span>
                    <span className="badge">Expert</span>
                  </div>
                  <a className="card-link" href="#learn">Watch</a>
                </article>

                <article className="events-card ev-volunteer animate-in" style={{'--i':3}}>
                  <div className="card-top">
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 5a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm-5 12l3-4 2 1 2 5H9z"/></svg>
                    <h4>Volunteer</h4>
                  </div>
                  <p>Support events and outreach — make a tangible difference.</p>
                  <div className="badges">
                    <span className="badge">Outreach</span>
                    <span className="badge">Community</span>
                  </div>
                  <a className="card-link" href="#contact">Volunteer</a>
                </article>
              </div>
            </section>

            {/* Contact */}
            <section className="contact" id="contact" aria-label="Contact">
              <h3>Contact Us</h3>
              <p className="contact-intro">Reach the team directly or send us a message.</p>
              <div className="panels-grid">
                <div className="panel">
                  <div className="panel-title">Send a Message</div>
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="form-grid">
                      <label>
                        Name
                        <div className="input-with-icon">
                          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="currentColor" d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 2.239-7 5v2h14v-2c0-2.761-3.134-5-7-5z"/>
                          </svg>
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-invalid={Boolean(errors.name)} aria-describedby="name-error" />
                        </div>
                        {errors.name && <span id="name-error" className="error">{errors.name}</span>}
                      </label>
                      <label>
                        Email
                        <div className="input-with-icon">
                          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="currentColor" d="M12 13L2 6.5V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6.5L12 13zm0-2l10-6H2l10 6z"/>
                          </svg>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} aria-describedby="email-error" />
                        </div>
                        {errors.email && <span id="email-error" className="error">{errors.email}</span>}
                      </label>
                      <label className="full">
                        Message
                        <div className="input-with-icon">
                          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16v12H7l-3 3V4z"/></svg>
                          <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." aria-invalid={Boolean(errors.message)} aria-describedby="message-error" />
                        </div>
                        {errors.message && <span id="message-error" className="error">{errors.message}</span>}
                      </label>
                    </div>
                    <button className="primary" type="submit">Send Message</button>
                    {submitted && <p className="success" role="status">Thanks! Your message is noted.</p>}
                  </form>
                </div>
                <div className="panel">
                  <div className="panel-title">Direct Contacts</div>
                  <ul className="recent-list">
                    <li className="recent-item"><span>Helpline</span><span className="meta">+91 90000 00000</span></li>
                    <li className="recent-item"><span>Email</span><span className="meta">support@care.example</span></li>
                    <li className="recent-item"><span>Address</span><span className="meta">Care Center, Main Road, City</span></li>
                  </ul>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem', marginTop: '.75rem' }}>
                    <a className="card-link" href="#home">Home</a>
                    <a className="card-link" href="#community">Support</a>
                  </div>
                </div>
              </div>
            </section>

            {/* Quotes Section */}
            <section className="quotes" id="quotes" aria-label="Real-time quotes">
              <h3>Daily Inspiration</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  id="offline-toggle"
                  type="checkbox"
                  checked={offlineMode}
                  onChange={(e) => setOfflineMode(e.target.checked)}
                />
                <label htmlFor="offline-toggle">Use offline quotes only</label>
              </div>
              {loadingQuote ? (
                <p>Loading quote…</p>
              ) : (
                <>
                  {quoteError && <p className="error">{quoteError}</p>}
                  <div className="depth-card">
                    <blockquote>
                      <p>{quote}</p>
                      {author && <footer>— {author}</footer>}
                    </blockquote>
                  </div>
                </>
              )}
              <button onClick={fetchQuote} className="secondary" aria-label="Refresh quote">Refresh Quote</button>
            </section>
          </>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-left">
            <div className="footer-brand">
              <MedicalBadge />
              <div className="brand-text">
                <strong>Cancer Awareness &amp; Support</strong>
                <span>Awareness, support, and care</span>
              </div>
            </div>
            <ul className="footer-social" aria-label="Social links">
              <li><a href="#facebook" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M13 9h3V6h-3c-1.657 0-3 1.343-3 3v3H7v3h3v6h3v-6h3l1-3h-4V9z"/></svg>
              </a></li>
              <li><a href="#x" aria-label="X">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 4l7.5 7.5L4 20h3l7.5-7.5L20 20h0l-7.5-7.5L20 4h-3l-7.5 7.5L7 4z"/></svg>
              </a></li>
              <li><a href="#linkedin" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4 4h4v16H4zM9 10h4v2h.1c.6-1.1 2.1-2.1 3.9-2.1 4.1 0 4.9 2.7 4.9 6.2V20h-4v-3.6c0-2.1-.1-4.7-3-4.7-3 0-3.5 2.3-3.5 4.6V20H9V10zM6 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>
              </a></li>
              <li><a href="#youtube" aria-label="YouTube">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M23 7s-.2-1.5-.8-2.2c-.7-.8-1.6-.8-2-.9C17.7 3.7 12 3.7 12 3.7h0s-5.7 0-8.2.3c-.4 0-1.3.1-2 .9C1.2 5.5 1 7 1 7S.8 8.7.8 10.4v1.2C.8 13.3 1 15 1 15s.2 1.5.8 2.2c.7.8 1.6.8 2 .9 2.5.3 8.2.3 8.2.3s5.7 0 8.2-.3c.4 0 1.3-.1 2-.9.6-.7.8-2.2.8-2.2s.2-1.7.2-3.4v-1.2C23.2 8.7 23 7 23 7zM9.8 13.7V8.9l5.5 2.4-5.5 2.4z"/></svg>
              </a></li>
            </ul>
          </div>
          <div className="footer-right">
            <a className="app-btn" href="#android" aria-label="Get the Android app">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M7 20h2V9H7v11zm8 0h2V9h-2v11zM5 12h14v2H5v-2zm9.8-6.4l1.4-1.4.7.7-1.4 1.4c.5.6.9 1.4 1 2.3H7.5c.1-.9.5-1.7 1-2.3L7.1 4.9l.7-.7 1.4 1.4c.8-.6 1.8-.9 2.8-.9s2 .3 2.8.9z"/></svg>
              <span>Get the Android app</span>
            </a>
            <a className="app-btn" href="#ios" aria-label="Get the iOS app">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M16.5 2c-.9.1-2 .6-2.6 1.4-.6.8-1.1 2-.9 3 .9.1 2-.5 2.7-1.3.6-.7 1.1-1.9.8-3.1zM19.1 13.6c0-2.9 2.4-3.8 2.5-3.9-1.4-2.1-3.6-2.4-4.4-2.4-1.9-.2-3.7 1.1-4.7 1.1-1 0-2.5-1.1-4.1-1.1-2.1 0-4.1 1.2-5.2 3.1-2.2 3.8-.6 9.5 1.6 12.6 1.1 1.6 2.5 3.3 4.3 3.2 1.8-.1 2.5-1 4.7-1 2.1 0 2.8 1 4.6.9 2-.1 3.2-1.6 4.4-3.1 1.4-2.1 2-4.2 2.1-4.3-.1-.1-4-1.6-4-6.1z"/></svg>
              <span>Get the iOS app</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}

export default App
