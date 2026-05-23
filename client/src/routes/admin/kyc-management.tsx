import KycVerificationPage from '@modules/admin/kyc/pages/KycManagementPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/kyc-management')({
  component: KycVerificationPage,
})

 
