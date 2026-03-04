import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/settings')({
    component: Settings,
})

function Settings() {
    return <div>Settings Page</div>
}
