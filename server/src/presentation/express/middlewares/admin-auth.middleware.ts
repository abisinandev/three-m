import type { JwtPayload } from "@domain/types/jwt-payload.type";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../utils/constants/env.constants";
import { UnauthorizedError } from "../utils/error-handling";
import { injectable } from "inversify";

@injectable()
export class AdminAuthMiddleware {
  constructor() { }

  async handle(req: Request, _res: Response, next: NextFunction) {
    try {
      const { accessToken } = req.cookies;
      if (!accessToken) {
        throw new UnauthorizedError("Unauthorized access");
      }

      const decoded = jwt.verify(
        accessToken,
        env.ACCESS_SECRET
      ) as JwtPayload;

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  }
}