import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@shared/components/auth/ButtonField";
import { InputField } from "@shared/components/auth/InputFields";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@stores/user/UserAuthStore";
import { useMutation } from "@tanstack/react-query";
import api from "@lib/axiosUser";
import { FORGOT_PASSWORD } from "@shared/constants/userContants";
import { ROUTES } from "@shared/constants/routes";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const setData = useAuthStore((s) => s.setData);

  const navigate = useNavigate();

  const forgotPasswordMutation = useMutation({
    mutationFn: async () => await api.post(FORGOT_PASSWORD, { email }),

    onSuccess: (res) => {
      toast.success(`${res.data.message} 🎉`);
      const expirationTime = Date.now() + 5 * 60 * 1000;
      setData(email, expirationTime);

      navigate({
        to: ROUTES.AUTH.FORGOT_PASSWORD.VERIFY_OTP,
        replace: true,
      });
    },

    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Forgot password failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    forgotPasswordMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button
        text={forgotPasswordMutation.isPending ? "Sending..." : "Send Reset OTP"}
        loading={forgotPasswordMutation.isPending}
        type="submit"
      />

      <p className="text-center text-xs text-cool-white/50 mt-6">
        Remember your password?{" "}
        <button
          type="button"
          className="text-teal-green font-medium hover:underline"
          onClick={() => navigate({ to: ROUTES.AUTH.LOGIN })}
        >
          Login here
        </button>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
