import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/nav-monitoring')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/nav-monitoring"!</div>
}

