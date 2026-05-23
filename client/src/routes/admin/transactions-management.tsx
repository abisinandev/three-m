import TransactionsManagementPage from '@modules/admin/transactions/pages/TransactionsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/transactions-management')({
  component: TransactionsManagementPage,
})

