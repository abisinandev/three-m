import { createFileRoute } from '@tanstack/react-router';
import AlgoTradingAdminPage from '../../modules/admin/algo-trading/page/AlgoTradingAdminPage';

export const Route = createFileRoute('/admin/algo-trading')({
  component: () => <AlgoTradingAdminPage />,
});
