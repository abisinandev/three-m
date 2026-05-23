import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import type { LoginType } from "@shared/types/user/LoginTypes";
import z from "zod";
import { LoginValidationSchema } from "@utils/validation/zodFormValidation";
import { useVerify2FA } from "@shared/services/user/use-verify-2fa";
import { LoginForm } from "../components/LoginComponent";
import { RightSidePanel } from "@shared/components/auth/RightSidePanel";
import { TwoFAModal } from "@shared/components/modals/TwoFaModal";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios-user";
import { LOGIN_API } from "@shared/constants/userContants";
import { ROUTES } from "@shared/constants/routes";
import { useUserStore } from "@stores/user/UserStore";

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const verify2faMutation = useVerify2FA();
    const [formData, setFormData] = useState<LoginType>({ email: "", password: "" });
    const [formErrors, setFormErrors] = useState<Record<keyof LoginType, string>>({ email: "", password: "" });
    const [is2faModalOpen, setIs2faModalOpen] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        try {
            const singleFieldSchema = LoginValidationSchema.pick({ [name]: true });
            singleFieldSchema.parse({ [name]: value });
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        } catch (err: unknown) {
            if (err instanceof z.ZodError) {
                const fieldError = err.issues[0]?.message || "";
                setFormErrors((prev) => ({ ...prev, [name]: fieldError }));
            }
        }
    };

    const loginMutation = useMutation({
        mutationFn: async () => await api.post(LOGIN_API,
            { email: formData.email, password: formData.password }
        ),
        onSuccess: (res) => {
            setQrCodeUrl(res.data.data.qrCode);
            setIs2faModalOpen(true);
            toast.info("Scan QR Code and verify your 2FA");
        },
        onError: (err: { response?: { data?: { message?: string } } }) => {
            console.log(err, '==============')
            toast.error(err.response?.data?.message || "Login failed")
        },
    })

    const handleLogin = () => {
        const result = LoginValidationSchema.safeParse(formData);
        if (!result.success) {
            const errors: typeof formErrors = { email: "", password: "" };
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof typeof errors;
                if (field) errors[field] = issue.message;
            });
            setFormErrors(errors);
            return;
        }

        loginMutation.mutate();
    };

    const handleVerify2FA = (code: string) => {
        verify2faMutation.mutate(
            { email: formData.email, code },
            {
                onSuccess: (res) => {
                    toast.success(res.data?.message || "2FA verified successfully!");
                    setIs2faModalOpen(false);
                    const userData = res.data.data.user;
                    useUserStore.getState().setUser(userData);
                    navigate({ to: ROUTES.USER.PROFILE, replace: true });
                },
                onError: () => toast.error("Invalid 2FA code"),
            }
        );
    };

    return (
        <div className="bg-deep-charcoal min-h-screen flex items-center justify-center px-4 text-text-primary">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="w-full max-w-[360px] mx-auto border border-neutral-800/60 bg-neutral-900/30 rounded-xl p-6 shadow-sm">
                    <h1 className="text-white text-center text-xl font-semibold mb-6 tracking-tight">
                        Welcome back
                    </h1>

                    <LoginForm
                        formData={formData}
                        formErrors={formErrors}
                        onChange={handleChanges}
                        onSubmit={handleLogin}
                        isLoading={loginMutation.isPending}
                    />

                    <p className="text-center text-[12px] text-neutral-500 mt-4">
                        Don’t have an account?{" "}
                        <a
                            onClick={() => navigate({ to: ROUTES.AUTH.SIGNUP.ROOT })}
                            className="text-teal-green font-medium hover:underline cursor-pointer"
                        >
                            Sign up
                        </a>
                    </p>
                </div>

                <RightSidePanel />
            </div>

            <TwoFAModal
                isOpen={is2faModalOpen}
                onClose={() => setIs2faModalOpen(false)}
                onVerify={handleVerify2FA}
                loading={verify2faMutation.isPending}
                qrCodeUrl={qrCodeUrl || ""}
            />
        </div>
    );
};

