import { InputField } from "@shared/components/auth/InputFields";
import { Button } from "@shared/components/auth/ButtonField";
import type { LoginType } from "@shared/types/user/LoginTypes";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import api from "@lib/axiosUser";
import { GOOGLE_AUTH } from "@shared/constants/userContants";
import { GoogleLogin } from "@react-oauth/google";
import { ROUTES } from "@shared/constants/routes";

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

    const googleMutation = useMutation({
        mutationFn: async (credential: string) =>
            await api.post(
                GOOGLE_AUTH,
                { provider: "google", token: credential },
                { withCredentials: true }
            ),

        onSuccess: () => {
            setTimeout(() => {
                navigate({ to: ROUTES.USER.HOME, replace: true });
            }, 1000);
        },

        onError: (err) => {
            console.error("Google Auth Error:", err);
        },
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

            <GoogleLogin
                onSuccess={(res) => googleMutation.mutate(res.credential!)}
                onError={() => console.log("Login Failed")}
                theme="filled_black"
                size="large"
                shape="pill"
                text="continue_with"
                logo_alignment="left"
                width="100%"
            />
        </div>
    );
};
