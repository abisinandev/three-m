import AlgoTradingPage from '@/modules/admin/page/AlgoTradingPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/algo-trading')({
  component: () => <AlgoTradingPage />,
});
