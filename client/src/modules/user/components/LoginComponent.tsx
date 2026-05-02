import { InputField } from "@shared/components/auth/InputFields";
import { Button } from "@shared/components/auth/ButtonField";
import type { LoginType } from "@shared/types/user/LoginTypes";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import api from "@lib/axiosUser";
import { GOOGLE_AUTH } from "@shared/constants/userContants";
import { useGoogleLogin } from "@react-oauth/google";
import { ROUTES } from "@shared/constants/routes";
import { useUserStore } from "@stores/user/UserStore";

interface LoginFormProps {
    formData: LoginType;
    formErrors: Record<keyof LoginType, string>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    formData,
    formErrors,
    onChange,
    onSubmit,
    isLoading,
}) => {
    const navigate = useNavigate();
    const { setUser } = useUserStore();

    const googleMutation = useMutation({
        mutationFn: async (credential: string) =>
            await api.post(
                GOOGLE_AUTH,
                { provider: "google", token: credential },
                { withCredentials: true }
            ),

        onSuccess: (res) => {
            setUser(res.data.data.user);
            setTimeout(() => {
                navigate({ to: ROUTES.USER.HOME, replace: true });
            }, 1000);
        },

        onError: (err) => {
            console.error("Google Auth Error:", err);
        },
    });

    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => googleMutation.mutate(codeResponse.access_token),
        onError: (error) => console.log("Login Failed:", error),
    });

    return (
        <div className="space-y-4">
            <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={onChange}
                error={formErrors.email}
            />

            <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={onChange}
                error={formErrors.password}
            />

            <div className="flex justify-between items-center text-[12px] mt-3 mb-3">
                <a
                    onClick={() => navigate({ to: ROUTES.AUTH.FORGOT_PASSWORD.ROOT })}
                    className="text-teal-green hover:underline cursor-pointer"
                >
                    Forgot password?
                </a>
            </div>

            <Button text="Login" onClick={onSubmit} loading={isLoading} disabled={isLoading} />

            <button
                type="button"
                onClick={() => googleLogin()}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-700/50 rounded-[5px] bg-[#121212] hover:bg-white hover:text-black transition-all duration-300 font-medium text-sm text-cool-white shadow-sm mt-4"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
            </button>
        </div>
    );
};
