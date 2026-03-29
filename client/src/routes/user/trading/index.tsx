import TradingDashboardPage from '@modules/user/pages/TradingDashboardPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/trading/')({
  component: TradingDashboardPage,
})
