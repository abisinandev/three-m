import { InputField } from "@shared/components/auth/InputFields";
import { Button } from "@shared/components/auth/ButtonField";
import type { SignupType } from "@shared/types/user/SignupTypes";

interface SignupFormProps {
  formData: SignupType;
  formErrors: Record<keyof SignupType, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  formData,
  formErrors,
  onChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <InputField
        label="Full name"
        name="fullName"
        type="text"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={onChange}
        error={formErrors.fullName}
      />
      <InputField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={onChange}
        error={formErrors.email}
      />
      <InputField
        label="Phone number"
        name="phone"
        type="tel"
        placeholder="Enter your phone number"
        value={formData.phone}
        onChange={onChange}
        error={formErrors.phone}
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={onChange}
        error={formErrors.password}
      />
      <InputField
        label="Confirm password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={onChange}
        error={formErrors.confirmPassword}
      />
      <Button
        text="Sign up"
        onClick={onSubmit}
        loading={isLoading}
        disabled={isLoading}
      />
    </div>
  );
};
