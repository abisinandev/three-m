import MutualFundsDashboard from '@modules/user/pages/MutualFundPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/mutual-funds')({
  component: MutualFundsDashboard,
})

 