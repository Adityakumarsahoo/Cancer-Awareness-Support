# Cancer Awareness & Support — Usage Guide

## Quick Start
- Install dependencies: `npm install`
- Run development server: `npm run dev`
- Open the app: `http://localhost:5173/`

## Navigation
- Home: `#home` — greeting, highlights, and quick actions
- Donate: `#donation` — donation dashboard with INR amounts
- Contact: `#contact` — professional contact form and direct contacts
- Quotes: `#quotes` — daily inspiration (offline/online sources)

## User Login (Step by Step)
- Go to Login: click the navbar login icon or visit `#login`
- Enter Email and Password
  - Email must be valid (e.g., `name@example.com`)
  - Password is any non-empty value (client-only validation)
- Click Login
- Result: form validates and simulates success (no backend)

## Admin Login (Step by Step)
- Go to Login: navbar login icon or `#login`
- Enter the admin email and password used by your organization
- Click Login
- Current behavior: the app does not enforce roles yet (no backend). Admins use the same UI and then access Settings, Donate, and Contact.
- For role-based features, integrate authentication and authorization on the backend; the UI is ready to connect.

## Sign Up (Optional)
- Go to Sign Up: `#signup`
- Fill in required fields (name, email, password, basic profile)
- Submit to simulate account creation (client-only)

## Donation Dashboard (INR)
- Open `#donation`
- Choose a quick tier: ₹100 / ₹250 / ₹500 / ₹1000 or enter a custom amount
- Click Donate — a demo confirmation appears
- Overview shows: Raised vs Goal, Total Donations, Donors, Ages, Progress
- Tabs: Overview, Donations (table), Donors (metrics), Settings (contact/support)

## Contact Us
- Open `#contact`
- Fill Name, Email, Message
- Submit — the form validates and shows a success note (client-only)
- Direct Contacts panel lists helpline, email, and address

## Quotes (Daily Inspiration)
- Open `#quotes`
- Toggle “Use offline quotes only” to switch sources
- Click “Refresh Quote” for a new quote
- Online sources auto-refresh hourly when enabled; offline list includes notable figures

## High-Level Flow (Text Flowchart)
```
User opens Home (#home)
  → Chooses action
    → Donate (#donation)
      → Select amount → Submit → Confirmation (demo)
    → Contact (#contact)
      → Fill form → Validate → Success (demo)
    → Login (#login)
      → Email+Password → Validate → Success (demo)
        → Admin and User both land on app UI (no role gates yet)
    → Quotes (#quotes)
      → Offline or Online → Refresh → Display
```

## Notes
- This project currently runs without a backend; forms use client-side validation and simulated success.
- INR currency formatting is applied across donation views.
- The footer provides brand, social links, and app CTAs for a professional finish.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
