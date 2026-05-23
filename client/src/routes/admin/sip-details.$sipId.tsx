import { createFileRoute } from '@tanstack/react-router'
import SipDetailsPage from '@modules/admin/sip/pages/SipDetailsPage'

export const Route = createFileRoute('/admin/sip-details/$sipId')({
    component: SipDetailsPage,
})

