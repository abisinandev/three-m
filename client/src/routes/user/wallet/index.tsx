import WalletPage from '@modules/user/wallet/pages/WalletPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/wallet/')({
  component: WalletPage,
})

 
