import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';


const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-center" richColors />
          <App />
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </StrictMode>
  )
}