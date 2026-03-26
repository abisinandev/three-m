import { createFileRoute } from '@tanstack/react-router'
import StockManagementPage from '../../modules/admin/page/StockManagementPage'

export const Route = createFileRoute('/admin/stock-management')({
  component: StockManagementPage,
})
