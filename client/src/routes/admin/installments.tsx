import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/installments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/installments"!</div>
}
