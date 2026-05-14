import { JobLogsPage } from '@/modules/admin/system/pages/JobLogsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/system-logs')({
  component: JobLogsPage
})
