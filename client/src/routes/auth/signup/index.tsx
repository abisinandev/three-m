import { createFileRoute } from '@tanstack/react-router'
import { SignupPage } from '@modules/user/auth/pages/SignupPage'

export const Route = createFileRoute('/auth/signup/')({
  component: SignupPage,
})
