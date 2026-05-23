import AuthenticationPage from '@/modules/admin/auth/pages/AuthenticationPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin-auth/admin/authentication/')({
  component: AuthenticationPage,
})

