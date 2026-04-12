import SubscriptionsPage from '@/modules/admin/subscription/SubscriptionsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/subscriptions')({
  component: SubscriptionsPage
})
