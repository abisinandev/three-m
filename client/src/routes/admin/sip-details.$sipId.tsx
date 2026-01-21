import { createFileRoute } from '@tanstack/react-router'
import SipDetailsPage from '@modules/admin/page/SipDetailsPage'

export const Route = createFileRoute('/admin/sip-details/$sipId')({
    component: SipDetailsPage,
})
