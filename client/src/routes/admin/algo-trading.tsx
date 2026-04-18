import AlgoTradingAdminPage from '@/modules/admin/page/AlgoTradingAdminPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/algo-trading')({
  component: () => <AlgoTradingAdminPage />,
});
