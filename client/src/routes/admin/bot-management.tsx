import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/bot-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/bot-management"!</div>
}

