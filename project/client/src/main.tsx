import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './locales'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { PlayerContextProvider } from './context/PlayerContext'
import { AuthProvider } from '@/hooks/useAuth'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> 
    <AuthProvider>
    <PlayerContextProvider>
      <App />
    </PlayerContextProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
