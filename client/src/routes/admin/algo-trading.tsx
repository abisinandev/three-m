<<<<<<< HEAD
import AlgoTradingAdminPage from '@/modules/admin/page/AlgoTradingAdminPage';
=======
import AlgoTradingPage from '@/modules/admin/page/AlgoTradingPage';
>>>>>>> 8d49cdd4b26558c6250c039ede81287f10c72c34
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/algo-trading')({
  component: () => <AlgoTradingPage />,
});
