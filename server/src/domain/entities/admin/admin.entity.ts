import { Role } from "@domain/enum/users/user-role.enum";
import { Email } from "@domain/entities/user/user-value-objects/email.vo";
import { Password } from "@domain/entities/user/user-value-objects/password.vo";

export class AdminEntity {
  private readonly _id?: string;
  private _adminCode: string;
  private _fullName: string;
  private _email: Email;
  private _password: Password;
  private _role: Role;
  private _permissions?: string | null;
  private _isBlocked: boolean;
  private _profile?: string | null;
  private _createdAt: Date;

  private constructor(props: {
    id?: string;
    adminCode: string;
    fullName: string;
    email: Email;
    password: Password;
    role: Role;
    permissions?: string | null;
    isBlocked?: boolean;
    profile?: string | null;
    createdAt?: Date;
  }) {
    this._id = props.id;
    this._adminCode = props.adminCode;
    this._fullName = props.fullName;
    this._email = props.email;
    this._password = props.password;
    this._role = props.role;
    this._permissions = props.permissions ?? null;
    this._isBlocked = props.isBlocked ?? false;
    this._profile = props.profile ?? null;
    this._createdAt = props.createdAt ?? new Date();
  }

  static create(props: {
    adminCode: string;
    fullName: string;
    email: string;
    password: string;
    role?: Role;
    permissions?: string | null;
    profile?: string | null;
  }): AdminEntity {
    return new AdminEntity({
      adminCode: props.adminCode,
      fullName: props.fullName,
      email: Email.create(props.email),
      password: Password.create(props.password),
      role: props.role ?? Role.ADMIN,
      permissions: props.permissions ?? null,
      profile: props.profile ?? null,
    });
  }

  static reconstitute(props: {
    id: string;
    adminCode: string;
    fullName: string;
    email: string;
    password: string;
    role: Role;
    permissions?: string | null;
    isBlocked?: boolean;
    profile?: string | null;
    createdAt?: Date;
  }): AdminEntity {
    return new AdminEntity({
      id: props.id,
      adminCode: props.adminCode,
      fullName: props.fullName,
      email: Email.create(props.email),
      password: Password.create(props.password),
      role: props.role,
      permissions: props.permissions ?? null,
      isBlocked: props.isBlocked ?? false,
      profile: props.profile ?? null,
      createdAt: props.createdAt,
    });
  }

  get id() {
    return this._id;
  }
  get adminCode() {
    return this._adminCode;
  }
  get fullName() {
    return this._fullName;
  }
  get email() {
    return this._email.value;
  }
  get password() {
    return this._password.value;
  }
  get role() {
    return this._role;
  }
  get isBlocked() {
    return this._isBlocked;
  }
  get permissions() {
    return this._permissions;
  }
  get profile() {
    return this._profile;
  }
  get createdAt() {
    return this._createdAt;
  }

  block() {
    this._isBlocked = true;
  }

  unblock() {
    this._isBlocked = false;
  }

  setPermissions(permissions: string | null) {
    this._permissions = permissions;
  }

  setProfile(profile: string | null) {
    this._profile = profile;
  }

  changePassword(newPassword: string) {
    this._password = Password.create(newPassword);
  }
}
