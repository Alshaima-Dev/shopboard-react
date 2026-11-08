import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/storefront.css'
import './styles/storefront-overrides.css'
import './styles/components.css'
import { App } from './App.tsx'
import { BrowserRouter } from 'react-router'

const root = document.getElementById('root')
if (!root) throw new Error('React root element is missing')

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
