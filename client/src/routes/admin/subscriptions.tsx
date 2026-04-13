import SubscriptionsPage from '@/modules/admin/page/SubscriptionsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/subscriptions')({
  component: SubscriptionsPage
})
