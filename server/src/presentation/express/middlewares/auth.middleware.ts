import type { IUserRepository } from "@application/interfaces/repositories/user-repository.interface";
import { ErrorMessage } from "@domain/enum/express/messages/error.message";
import type { JwtPayload } from "@domain/types/jwt-payload.type";
import { USER_TYPES } from "@infrastructure/inversify_di/types/user/user.types";
import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";
import { env } from "../utils/constants/env.constants";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/error-handling";
import { logger } from "@infrastructure/providers/logger/pino.logger";

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(USER_TYPES.UserRepository) private readonly _userRepository: IUserRepository,
  ) { }

  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken } = req.cookies;
      logger.info(`Access_token: ${accessToken}`);

      if (!accessToken) {
        throw new UnauthorizedError("Unauthorized access");
      }

      const decoded = jwt.verify(accessToken, env.ACCESS_SECRET) as JwtPayload;
      const userId = decoded.id;

      const user = await this._userRepository.findById(userId);
      if (!user) throw new NotFoundError(ErrorMessage.USER_NOT_FOUND);

      if (user.isBlocked) {
        res.clearCookie("accessToken", { httpOnly: true, sameSite: "lax" });
        res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax" });
        throw new ForbiddenError(ErrorMessage.ACCOUNT_BLOCKED_ADMIN);
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  }
}
