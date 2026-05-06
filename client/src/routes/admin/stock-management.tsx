import StockManagementPage from '@/modules/admin/stock/pages/StockManagementPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/stock-management')({
  component: StockManagementPage,
})

