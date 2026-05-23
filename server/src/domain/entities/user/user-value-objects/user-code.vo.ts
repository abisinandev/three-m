import { v4 as uuidv4 } from "uuid";
import { ValueObjectBase } from "../../../value-object/vo.base-class";

interface IUserCode {
  value: string;
}

export class UserCode extends ValueObjectBase<IUserCode> {
  private constructor(props: IUserCode) {
    super(props);
  }

  static create(prefix = "USR"): UserCode {
    const randomLetters = UserCode.generateLetters(1);
    const randomNumber = UserCode.generateNumbers(3);

    const code = `${prefix}${randomLetters}${randomNumber}`;
    return new UserCode({ value: code });
  }

  static rebuild(value: string): UserCode {
    return new UserCode({ value });
  }

  static fromExisting(value: string): UserCode {
    if (!/^[A-Z]{3,5}[A-Z]{1}\d{3}$/.test(value)) {
      throw new Error("Invalid user code format");
    }
    return new UserCode({ value });
  }

  private static generateLetters(length: number): string {
    const letters = uuidv4()
      .replace(/[^A-Z]/gi, "")
      .substring(0, length)
      .toUpperCase();

    if (letters.length < length) {
      return UserCode.randomFallbackLetters(length);
    }

    return letters;
  }

  private static randomFallbackLetters(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private static generateNumbers(length: number): string {
    const digits = Math.floor(Math.random() * 10 ** length)
      .toString()
      .padStart(length, "0");
    return digits;
  }

  get value(): string {
    return this.props.value;
  }
}
