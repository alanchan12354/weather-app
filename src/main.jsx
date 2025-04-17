import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import App from './App.jsx'

// ─── Initialize Google Analytics ─────────────────────────────────────────
// Measurement ID
ReactGA.initialize('G-YXCNY8WX4N')
// log the initial pageview
ReactGA.send('pageview')

// ─── Render App ──────────────────────────────────────────────────────────
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
