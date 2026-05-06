import SipManagementPage from '@modules/admin/sip/pages/SipManagementPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/sip-management')({
  component: SipManagementPage,
})
 
