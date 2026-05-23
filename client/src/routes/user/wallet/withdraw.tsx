import WithdrawPage from '@modules/user/wallet/pages/WithdrawalPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/wallet/withdraw')({
  component: WithdrawPage,
})

 
