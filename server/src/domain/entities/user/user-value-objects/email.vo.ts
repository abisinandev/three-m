import { ValueObjectBase } from "../../../value-object/vo.base-class";

interface EmailProps {
  value: string;
}

export class Email extends ValueObjectBase<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  static create(email: string): Email {
    if (!email) throw new Error("Email is required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    return new Email({ value: email.toLowerCase() });
  }

  get value(): string {
    return this.props.value;
  }
}
