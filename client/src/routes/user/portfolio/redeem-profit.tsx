import RedeemProfitPage from '@modules/user/wallet/pages/RedeemProfitPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/portfolio/redeem-profit')({
    component: RedeemProfitPage,
})

