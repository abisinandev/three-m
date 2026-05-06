import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SignupApi } from "@shared/services/user/signup-api";
import type { SignupType } from "@shared/types/user/SignupTypes";
 

export const useSignup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newUser: SignupType) => SignupApi(newUser),

        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            console.log('Signup successfull✅: ', res.data);
        },

        onError: (error: any) => {
            console.log(error)
            console.error("Signup failed ❌", error.response?.data || error.message);
        }
    })
}

