import AlgoTradingPage from '@/modules/admin/algo-trading/pages/AlgoTradingPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/algo-trading')({
  component: () => <AlgoTradingPage />,
});

 