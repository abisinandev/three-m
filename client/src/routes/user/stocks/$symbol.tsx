import StockDetailPage from '@modules/user/stock/pages/StockDetailPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/stocks/$symbol')({
  component: StockDetailPage,
})
