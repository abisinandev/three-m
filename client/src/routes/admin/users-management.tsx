import UserManagmentPage from '@modules/admin/user/pages/UserManagmentPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/users-management')({
  component: UserManagmentPage,
})
 
