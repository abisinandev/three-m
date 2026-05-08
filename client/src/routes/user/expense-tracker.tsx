import ExpenseTracker from '@modules/user/expense-tracker/pages/ExpenseTracker'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/expense-tracker')({
  component: ExpenseTracker,
})


 
