import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './Contexts/AuthContext.jsx'
import { OrderProvider } from './Contexts/OrderContext.jsx'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <OrderProvider>
       <BrowserRouter>
          <App />
        </BrowserRouter>
      </OrderProvider>
    </AuthProvider>
  </StrictMode>
)
