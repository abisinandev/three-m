import type { SignupType } from '@shared/types/user/SignupTypes'
import { API_ROUTES } from '@shared/constants/apiRoutes'
import api from "../../../lib/axios-user";


export const SignupApi = async (data: SignupType) => {
    const response = await api.post(API_ROUTES.USER.AUTH.SIGNUP, data, {
        headers: { 'Content-Type': 'application/json' },
    })
    console.log('Signup response: ', response)
    return response
}