import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import type { LoginType } from "@shared/types/user/LoginTypes";
import z from "zod";
import { LoginValidationSchema } from "@utils/validation/zodFormValidation";
import { useVerify2FA } from "@shared/services/user/useVerify2FA";
import { LoginForm } from "../components/LoginComponent";
import { RightSidePanel } from "@shared/components/auth/RightSidePanel";
import { TwoFAModal } from "@shared/components/modals/TwoFaModal";
import { useMutation } from "@tanstack/react-query";
import api from "@lib/axiosUser";
import { LOGIN_API } from "@shared/constants/userContants";

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
        } catch (err: any) {
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
        onError: (err: any) => {
            console.log(err,'==============')
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
                    navigate({ to: "/user/profile", replace: true });
                },
                onError: () => toast.error("Invalid 2FA code"),
            }
        );
    };

    return (
        <div className="bg-deep-charcoal min-h-screen flex items-center justify-center px-4 text-text-primary">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="w-full max-w-sm mx-auto border border-neutral-800 rounded-2xl p-6">
                    <h1 className="text-white text-center text-3xl lg:text-4xl font-extrabold mb-8 tracking-wide">
                        Welcome Back
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
                            onClick={() => navigate({ to: "/auth/signup" })}
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
