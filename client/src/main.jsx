import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WalletAdapter from './components/WalletAdapter/WalletAdapter.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WalletAdapter />
  </StrictMode>,
)
