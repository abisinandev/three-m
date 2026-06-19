import AdminTradesPage from '@/modules/admin/trades/pages/AdminTradesPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/trades')({
  component: () => <AdminTradesPage />,
});
