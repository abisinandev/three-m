import StockDetailPage from '@modules/user/pages/StockDetailPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/trading/$symbol')({
  component: StockDetailPage,
})
