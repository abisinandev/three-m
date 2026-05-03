
import { MarketNewsPage } from '@modules/user/pages/MarketNewsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/market-news')({
  component: MarketNewsPage,
})


