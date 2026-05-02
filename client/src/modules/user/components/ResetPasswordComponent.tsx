import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { InputField } from "@shared/components/auth/InputFields";
import { Button } from "@shared/components/auth/ButtonField";
import { useAuthStore } from "@stores/user/UserAuthStore";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { ResetPasswordApi } from "@shared/services/user/ResetPasswordApi";
import { ROUTES } from "@shared/constants/routes";

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { email, token, clearData } = useAuthStore();
  console.log('Email: ', email, "---", "Token: ", token)
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });


  const resetPasswordMutation = useMutation({
    mutationFn: async () =>
      ResetPasswordApi({
        email: email as string,
        resetToken: token as string,
        password: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }),

    onSuccess: (res) => {
      toast.success(res.data.message || "Password reset successful");
      clearData();
      navigate({ to: ROUTES.AUTH.LOGIN });
    },

    onError: (err) => {
      console.log("Password reset error: ", err);
      toast.error("Password reset failed");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in both fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!email || !token) {
      toast.error("Missing credentials");
      return;
    }

    resetPasswordMutation.mutate();
  };

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
              onClick={() =>
                navigate({ to: ROUTES.AUTH.LOGIN })
              }
              className="flex items-center gap-2 text-neutral-400 hover:text-teal-green transition mb-5 text-xs"
            >
              <ArrowLeft size={16} />
              Back to login
            </button>

            <h1 className="text-xl font-semibold text-white text-center mb-2 tracking-tight">
              Set new password
            </h1>
            <p className="text-center text-cool-white/60 text-xs mb-6">
              Your new password must be different from previous ones.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleChange}
              />

              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <Button
                text={resetPasswordMutation.isPending ? "Processing..." : "Confirm"}
                loading={resetPasswordMutation.isPending}
                type="submit"
              />
            </form>

            <p className="text-center text-xs text-cool-white/50 mt-6">
              Remembered your password?{" "}
              <button
                onClick={() => navigate({ to: ROUTES.AUTH.LOGIN })}
                className="text-teal-green font-medium hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-teal-green/20 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-16 h-16 text-teal-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-cool-white">Secure Password Reset</h2>
              <p className="text-cool-white/60 mt-2">
                Your account security is our top priority
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
