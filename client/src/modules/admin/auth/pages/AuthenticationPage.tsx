import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { RightSidePanel } from "@shared/components/auth/RightSidePanel";
import { useMutation } from "@tanstack/react-query";
import { AuthenticationApi } from "@/shared/services/admin/auth/authentication-api";
import { useAuthStore } from "@stores/user/UserAuthStore";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "@shared/constants/routes";

interface FormErrors {
    adminCode?: string;
    password?: string;
}

const AuthenticationPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [adminCode, setAdminCode] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const { setData } = useAuthStore();
    const navigation = useNavigate();

    const authMutation = useMutation({
        mutationFn: () => AuthenticationApi({ adminCode, password }),
        onSuccess: (res) => {
            const expirationTime = Date.now() + 5 * 60 * 1000;
            setData(res.data.data.email, expirationTime)
            toast.success(res.data.message || "OTP sent to your registered email");
            navigation({
                to: ROUTES.ADMIN.AUTH.VERIFY_OTP,
                replace: true
            })
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Authentication failed");
        },
    });

    const validateField = (name: string, value: string): string => {
        if (name === "adminCode") {
            if (!value) return "Admin code is required";
            if (value.length < 4) return "Admin code must be at least 4 characters";
            if (!/^[A-Z0-9]+$/.test(value)) return "Only uppercase letters & numbers allowed";
        }
        if (name === "password") {
            if (!value) return "Password is required";
            if (value.length < 6) return "Password must be at least 6 characters";
        }
        return "";
    };

    const handleAdminCodeChange = (value: string) => {
        const upperValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        setAdminCode(upperValue);

        const error = validateField("adminCode", upperValue);
        setErrors(prev => ({ ...prev, adminCode: error }));
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        const error = validateField("password", value);
        setErrors(prev => ({ ...prev, password: error }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const adminCodeError = validateField("adminCode", adminCode);
        const passwordError = validateField("password", password);

        if (adminCodeError || passwordError) {
            setErrors({ adminCode: adminCodeError, password: passwordError });
            toast.error("Please fix the errors below");
            return;
        }

        authMutation.mutate();
    };

    const hasError = (field: keyof FormErrors) => !!errors[field];

    return (
        <div className="bg-deep-charcoal min-h-screen flex items-center justify-center px-4 text-text-primary">
            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                <div className="w-full max-w-[360px] mx-auto border border-neutral-800/60 bg-neutral-900/30 rounded-xl p-6 shadow-sm">
                    <div>
                        <h1 className="text-white text-center text-xl font-semibold mb-6 tracking-tight">
                            Admin Authentication
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <label className="block text-gray-400 text-xs font-medium mb-1.5">
                                    Admin code
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={adminCode}
                                        onChange={(e) => handleAdminCodeChange(e.target.value)}
                                        placeholder="Enter admin code"
                                        maxLength={12}
                                        className={`w-full px-4 py-2.5 bg-[#111111] border rounded-lg text-white placeholder-gray-600 text-sm font-mono tracking-wider focus:outline-none focus:ring-1 transition ${hasError("adminCode")
                                            ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/20"
                                            : "border-neutral-800 focus:border-teal-green focus:ring-teal-green/30"
                                            }`}
                                    />
                                    {hasError("adminCode") && (
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                            <AlertCircle size={16} className="text-red-500" />
                                        </div>
                                    )}
                                </div>
                                {hasError("adminCode") && (
                                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        {errors.adminCode}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-gray-400 text-xs font-medium mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => handlePasswordChange(e.target.value)}
                                        placeholder="••••••••"
                                        className={`w-full px-4 py-2.5 bg-[#111111] border rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-1 transition pr-10 ${hasError("password")
                                            ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/20"
                                            : "border-neutral-800 focus:border-teal-green focus:ring-teal-green/30"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    {hasError("password") && (
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        </div>
                                    )}
                                </div>
                                {hasError("password") && (
                                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                {/* <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-3.5 h-3.5 rounded border-gray-600 bg-[#111111] text-teal-green focus:ring-teal-green/40"
                                    />
                                    <span className="text-gray-500">Remember me</span>
                                </label> */}
                            </div>

                            <button
                                type="submit"
                                disabled={authMutation.isPending || !!errors.adminCode || !!errors.password}
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-2.5 rounded shadow-sm transition-all duration-200"
                            >
                                {authMutation.isPending ? "Processing..." : "Authenticate"}
                            </button>
                        </form>

                        <p className="text-center text-[10px] text-gray-500 mt-5 font-medium">
                            Protected access • Admin only
                        </p>
                    </div>
                </div>

                <RightSidePanel />
            </div>
        </div>
    );
};

export default AuthenticationPage;
