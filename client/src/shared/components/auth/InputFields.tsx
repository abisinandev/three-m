import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { InputFieldProps } from "@modules/user/types/InputField";

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full">
      <label className="text-neutral-500 text-xs block mb-1 font-medium">{label}</label>

      <div className="relative">
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full border border-border-gray-dark rounded bg-transparent text-text-primary placeholder-neutral-500
            px-3 py-2 text-[12px] focus:outline-none focus:border-teal-green focus:ring-1 focus:ring-teal-green transition-all"
          style={{ paddingRight: type === "password" ? "2.5rem" : undefined }}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-neutral-600 hover:text-neutral-800 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
