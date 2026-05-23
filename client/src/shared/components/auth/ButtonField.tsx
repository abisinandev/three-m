import type { ButtonProps } from "@modules/user/types/ButttonProps";


export const Button: React.FC<ButtonProps> = ({ text, onClick, disabled, loading, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="w-full bg-teal-green hover:bg-green-600 text-white font-semibold text-sm py-2.5 rounded shadow-md transition-all duration-200 disabled:opacity-50"
  >
    {loading ? "Processing..." : text}
  </button>
);