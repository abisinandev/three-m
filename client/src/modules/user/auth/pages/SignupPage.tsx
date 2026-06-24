import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@stores/user/UserAuthStore";
import { SignupForm } from "../components/SignupForm";
import type { SignupType } from "@shared/types/user/SignupTypes";
import { SignupValidationSchema } from "@utils/validation/zodFormValidation";
import { RightSidePanel } from "@shared/components/auth/RightSidePanel";
import { useSignup } from "../hooks/use-signup";
import z from "zod";
import { useGoogleLogin } from "@react-oauth/google";
import api from "@/lib/axios-user";
import { useMutation } from "@tanstack/react-query";

import { useUserStore } from "@stores/user/UserStore";
import { ROUTES, API_ROUTES } from '@shared/constants/apiRoutes';

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const signupMutation = useSignup();
    const { setUser } = useUserStore();

    const [formData, setFormData] = useState<SignupType>({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [formErrors, setFormErrors] = useState<Record<keyof SignupType, string>>({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const handleNavigate = () => {
            if (window.location.pathname.includes(ROUTES.AUTH.SIGNUP.VERIFY_OTP)) {
                window.history.replaceState(null, '', ROUTES.AUTH.SIGNUP.ROOT);
            }
        };
        window.addEventListener('popstate', handleNavigate);
        return () => window.removeEventListener('popstate', handleNavigate);
    }, []);

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        try {
            const singleFieldSchema = SignupValidationSchema.pick({ [name]: true });
            singleFieldSchema.parse({ [name]: value });
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        } catch (err: unknown) {
            if (err instanceof z.ZodError) {
                const fieldError = err.issues[0]?.message || "";
                setFormErrors((prev) => ({ ...prev, [name]: fieldError }));
            }
        }
    };

    const googleMutation = useMutation({
        mutationFn: async (credential: string) =>
            await api.post(
                API_ROUTES.USER.AUTH.GOOGLE_AUTH,
                { provider: "google", token: credential },
                { withCredentials: true }
            ),

        onSuccess: (res) => {
            setUser(res.data.data.user);
            navigate({ to: ROUTES.USER.HOME, replace: true });
        },

        onError: (err) => {
            console.error("Google Auth Error:", err);
        },
    });

    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => googleMutation.mutate(codeResponse.access_token),
        onError: (error) => console.log("Login Failed:", error),
    });

    const handleSignup = () => {
        const result = SignupValidationSchema.safeParse(formData);
        if (!result.success) {
            const errors: typeof formErrors = {
                fullName: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
            };
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof typeof errors;
                if (field) errors[field] = issue.message;
            });
            setFormErrors(errors);
            return;
        }

        setFormErrors({
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        });

        signupMutation.mutate(result.data, {
            onSuccess: (res: { data: { message: string } }) => {
                if (res.data) {
                    const { clearData, setData } = useAuthStore.getState();
                    clearData();

                    const expirationTime = Date.now() + 5 * 60 * 1000;
                    setData(formData.email, expirationTime);

                    toast.success(res?.data.message);

                    setTimeout(() => {
                        navigate({
                            to: ROUTES.AUTH.SIGNUP.VERIFY_OTP,
                            replace: true,
                        });
                    }, 50);
                }
            },
            onError: (err: unknown) => {
                const error = err as { response?: { data?: { message?: string; data?: { errors?: Record<string, string> } } } };
                const backendErrors = error.response?.data?.data?.errors;
                if (backendErrors) {
                    setFormErrors((prev) => ({
                        ...prev,
                        ...(backendErrors as Partial<Record<keyof SignupType, string>>)
                    }));
                    toast.error(error.response?.data?.message || "Validation failed");
                } else {
                    toast.error(error.response?.data?.message || "Verification failed");
                }
            },
        });
    };

    return (
        <div className="bg-deep-charcoal min-h-screen flex items-center justify-center px-4 text-text-primary">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="w-full max-w-[360px] mx-auto border border-neutral-800/60 bg-neutral-900/30 rounded-xl p-6 shadow-sm">
                    <h1 className="text-white text-center text-xl font-semibold mb-6 tracking-tight">
                        Create an account
                    </h1>
                    <SignupForm
                        formData={formData}
                        formErrors={formErrors}
                        onChange={handleChanges}
                        onSubmit={handleSignup}
                        isLoading={signupMutation.isPending}
                    />
                    <div className="text-xs text-center mt-4 mb-4">
                        <span className="text-white">Already have an account? </span>
                        <a onClick={() => navigate({ to: ROUTES.AUTH.LOGIN })} className="text-teal-green hover:underline font-medium">
                            Login
                        </a>
                    </div>
                    <button
                        type="button"
                        onClick={() => googleLogin()}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-700/50 rounded-[5px] bg-[#121212] hover:bg-white hover:text-white transition-all duration-300 font-medium text-sm text-cool-white shadow-sm mt-2"
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
                <RightSidePanel />
            </div>
        </div>
    );
};
