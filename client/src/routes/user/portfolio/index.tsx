import PortfolioDashboard from '@modules/user/portfolio/pages/PortfolioPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/portfolio/')({
  component: PortfolioDashboard,
})

 

