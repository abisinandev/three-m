import PaymentFailurePage from '@shared/components/payment/PaymentFailurePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/_payment/payment-failed')({
  component: PaymentFailurePage,
})

 