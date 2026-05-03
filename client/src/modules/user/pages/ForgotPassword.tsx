import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { RightSidePanel } from "@shared/components/auth/RightSidePanel";
import ForgotPasswordForm from "../components/ForgotPassword";
import { ROUTES } from "@shared/constants/routes";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-deep-charcoal flex items-center justify-center px-4 overflow-hidden">

            <div className="absolute inset-0 -z-10">
                <div className="absolute top-16 left-16 w-64 h-64 bg-teal-green/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-16 right-16 w-56 h-56 bg-electric-orange/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
            </div>

            <div className="w-full max-w-3xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

                <div className="w-full max-w-[360px] mx-auto border border-neutral-800/60 bg-neutral-900/30 rounded-xl p-6 shadow-sm">
                    <div className="backdrop-blur-xl bg-transparent">

                        <button
                            onClick={() => navigate({ to: ROUTES.AUTH.LOGIN })}
                            className="flex items-center gap-2 text-neutral-400 hover:text-teal-green transition mb-5 text-xs"
                        >
                            <ArrowLeft size={16} />
                            Back to login
                        </button>

                        <h1 className="text-xl font-semibold text-white text-center mb-2 tracking-tight">
                            Forgot password?
                        </h1>

                        <p className="text-center text-cool-white/60 text-sm mb-8">
                            No worries! Enter your email and we'll send an OTP to your mail.
                        </p>

                        <ForgotPasswordForm />
                    </div>
                </div>

                <div className="hidden lg:block">
                    <RightSidePanel />
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
