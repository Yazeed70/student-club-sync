
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/globals.css'
import { ThemeProvider } from './components/ThemeProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="blaze-ui-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
