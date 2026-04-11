import PaymentSuccessPage from '@shared/components/payment/PaymentSuccessPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/_payment/payment-success')({
  
  component: PaymentSuccessPage,
  
})

 