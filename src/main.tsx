import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './style/layout/assets/assetspage.tsx'
import "./script/wallet.ts"
// import "./script/testnet.ts"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
