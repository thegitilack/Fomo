import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { DesignSystem } from './DesignSystem'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DesignSystem />
  </StrictMode>
)
