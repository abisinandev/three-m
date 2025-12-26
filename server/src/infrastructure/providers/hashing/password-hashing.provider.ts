import type { IPasswordHashingService } from "@application/interfaces/services/externals/password-hashing.service.interface";
import argon2 from "argon2";

export class PasswordHashingService implements IPasswordHashingService {
  async hash(password: string): Promise<string> {
    return await argon2.hash(password, { parallelism: 2 });
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
 