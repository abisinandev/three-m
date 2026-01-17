import PortfolioDashboard from '@modules/user/pages/PortfolioPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/portfolio/')({
  component: PortfolioDashboard,
})

 
