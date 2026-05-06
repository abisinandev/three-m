import AddMutualFundPage from '@/modules/admin/mutual-fund/pages/AddMutualFunds'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/_mutual-fund/add-new-fund')({
  component: AddMutualFundPage,
})

 