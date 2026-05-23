import MutualFundsPage from '@/modules/admin/mutual-fund/pages/MutualFundManagementPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/admin/_mutual-fund/mutual-funds-management',
)({
    component: MutualFundsPage
})


