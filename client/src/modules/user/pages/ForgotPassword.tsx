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

                <div className="w-full max-w-sm mx-auto border border-border-gray-dark rounded-2xl p-6">
                    <div className="backdrop-blur-xl bg-deep-charcoal/70 rounded-2xl p-6 shadow-xl">

                        <button
                            onClick={() => navigate({ to: ROUTES.AUTH.LOGIN })}
                            className="flex items-center gap-2 text-cool-white/60 hover:text-teal-green transition mb-6 text-sm"
                        >
                            <ArrowLeft size={18} />
                            Back to Login
                        </button>

                        <h1 className="text-2xl lg:text-3xl font-bold text-cool-white text-center mb-3">
                            Forgot Password?
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
