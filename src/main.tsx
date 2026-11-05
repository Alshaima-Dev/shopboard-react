import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/storefront.css'
import { App } from './App.tsx'

const root = document.getElementById('root')
if (!root) throw new Error('React root element is missing')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
