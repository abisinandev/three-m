import DashboardPage from '@modules/user/dashboard/pages/DashboardPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/home')({
  component: DashboardPage,
})

 
