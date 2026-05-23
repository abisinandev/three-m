import SubscriptionsPage from '@/modules/admin/subscription/pages/SubscriptionsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/subscriptions')({
  component: SubscriptionsPage
})

