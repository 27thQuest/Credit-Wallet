import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './style/layout/assets/assetspage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
