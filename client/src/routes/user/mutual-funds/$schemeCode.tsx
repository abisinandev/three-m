import MutualFundDetailsPage from '@modules/user/mutual-fund/pages/MutualFundDetailsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/mutual-funds/$schemeCode')({
  component: MutualFundDetailsPage,
})

