import { ErrorMessages } from "@shared/constants/error.messages";
import { HttpStatus } from "@domain/enum/express/status-code";
import AppError from "@presentation/express/utils/error-handling/app.error";
import type { ClassConstructor } from "class-transformer";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { NextFunction, Request, Response } from "express";

export const validateDTO = <T extends object>(
  dtoClass: ClassConstructor<T>,
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    console.log("dtoInstance: ", dtoInstance);

    const errors = await validate(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      const formattedErrors: Record<string, string> = {};

      errors.forEach((err) => {
        formattedErrors[err.property] = Object.values(
          err.constraints || {},
        ).join(", ");
      });

      throw new AppError(
        ErrorMessages.AUTH.INVALID_CREDENTIALS,
        HttpStatus.BAD_REQUEST,
        { errors: formattedErrors },
      );
    }
    req.body = dtoInstance;
    next();
  };
};
