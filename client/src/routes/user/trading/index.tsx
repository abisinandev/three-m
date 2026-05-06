import StockDashboardPage from '@modules/user/stock/pages/StockDashboardPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/trading/')({
  component: StockDashboardPage,
})

