import AddToWallet from '@modules/user/pages/AddToWalletPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/wallet/add-to-wallet')({
  component:  AddToWallet,
})

