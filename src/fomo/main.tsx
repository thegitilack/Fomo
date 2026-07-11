import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { App } from './App'

const BUILD_ID = 'nav-shell-2026-07-12b'
console.log('%cFOMO build: ' + BUILD_ID, 'color:#c6a47a;font-weight:bold')
;(window as unknown as { __FOMO_BUILD__: string }).__FOMO_BUILD__ = BUILD_ID

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
