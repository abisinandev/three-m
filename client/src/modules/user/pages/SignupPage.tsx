import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@stores/user/UserAuthStore";
import { SignupForm } from "../components/SignupForm";
import type { SignupType } from "@shared/types/user/SignupTypes";
import { SignupValidationSchema } from "@utils/validation/zodFormValidation";
import { RightSidePanel } from "@shared/components/auth/RightSidePanel";
import { useSignup } from "../hooks/UseSignup";
import z from "zod";
import { GoogleLogin } from "@react-oauth/google";
import api from "@lib/axiosUser";
import { useMutation } from "@tanstack/react-query";
import { GOOGLE_AUTH } from "@shared/constants/userContants";
import { useUserStore } from "@stores/user/UserStore";

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
            if (window.location.pathname.includes('/auth/signup/verify-otp')) {
                window.history.replaceState(null, '', '/auth/signup');
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
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const fieldError = err.issues[0]?.message || "";
                setFormErrors((prev) => ({ ...prev, [name]: fieldError }));
            }
        }
    };

    const googleMutation = useMutation({
        mutationFn: async (credential: string) =>
            await api.post(
                GOOGLE_AUTH,
                { provider: "google", token: credential },
                { withCredentials: true }
            ),

        onSuccess: (res) => {
            setUser(res.data.user);
            navigate({ to: "/user/home", replace: true });
        },

        onError: (err) => {
            console.error("Google Auth Error:", err);
        },
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
            onSuccess: (res: any) => {
                if (res.data) {
                    const { clearData, setData } = useAuthStore.getState();
                    clearData();

                    const expirationTime = Date.now() + 5 * 60 * 1000;
                    setData(formData.email, expirationTime);

                    toast.success(res?.data.message);

                    setTimeout(() => {
                        navigate({
                            to: "/auth/signup/verify-otp",
                            replace: true,
                        });
                    }, 50);
                }
            },
            onError: (err: any) => toast.error(err.response?.data?.message || "Verification failed"),
        });
    };

    return (
        <div className="bg-deep-charcoal min-h-screen flex items-center justify-center px-4 text-text-primary">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div className="w-full max-w-sm mx-auto">
                    <h1 className="text-white text-center text-3xl lg:text-4xl font-bold mb-8 tracking-wide">
                        SIGN UP
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
                        <a onClick={() => navigate({ to: "/auth/login" })} className="text-teal-green hover:underline font-medium">
                            Login
                        </a>
                    </div>
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
                <RightSidePanel />
            </div>
        </div>
    );
};
