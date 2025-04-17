import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'         // ← import GA helper
import App from './App.jsx'

// ─── Initialize Google Analytics ─────────────────────────────────────────
ReactGA.initialize('G-YXCNY8WX4N')      // ← replace with your real Measurement ID
ReactGA.send('pageview')               // ← log the initial pageview

// ─── Render App ──────────────────────────────────────────────────────────
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
