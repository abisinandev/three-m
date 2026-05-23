import { ValueObjectBase } from "../../../value-object/vo.base-class";

interface PhoneProps {
  country_code?: string;
  value: string;
}

export class Phone extends ValueObjectBase<PhoneProps> {
  private constructor(props: PhoneProps) {
    super(props);
  }

  static create(phone: string): Phone {
    if (!phone) throw new Error("Phone number is required");

    // const phoneRegex = /^\d{10}$/;
    // if (!phoneRegex.test(phone)) {
    //   throw new Error("Invalid phone number");
    // }

    return new Phone({ value: phone });
  }

  get value(): string {
    return this.props.value;
  }
}
