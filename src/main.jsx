import { createRoot } from 'react-dom/client'
import './index.css'
import App from './AppNew.tsx'
import { ErrorBoundary } from './ui/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)
