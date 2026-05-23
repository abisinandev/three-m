import { ValueObjectBase } from "../../../value-object/vo.base-class";

interface PasswordProps {
  value: string;
}

export class Password extends ValueObjectBase<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  static create(password: string): Password {
    if (!password) throw new Error("Password is required");

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    return new Password({ value: password });
  }

  static rebuild(value: string): Password {
    return new Password({ value });
  }

  get value(): string {
    return this.props.value;
  }
}
