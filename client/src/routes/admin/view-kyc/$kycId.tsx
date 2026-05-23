import ViewKycDocPage from '@/modules/admin/kyc/pages/ViewKycDocsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/view-kyc/$kycId')({
  component: ViewKycDocPage
})

