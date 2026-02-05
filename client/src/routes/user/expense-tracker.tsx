import ExpenseTracker from '@modules/user/pages/ExpenseTracker'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/expense-tracker')({
  component: ExpenseTracker,
})


 