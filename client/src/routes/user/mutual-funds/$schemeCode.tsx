import MutualFundDetailsPage from '@modules/user/pages/MutualFundDetailsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/mutual-funds/$schemeCode')({
  component: MutualFundDetailsPage,
})
