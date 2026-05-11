import {
    NextFunction,
    Request,
    Response
} from "express";
import { ValidationError } from "../utils/error-handling";

export const idempotencyMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {

    const key = req.headers["x-idempotency-key"];

    if (!key) {
        throw new ValidationError(
            "Missing X-Idempotency-Key"
        );
    }

    req.idempotencyKey = String(key);

    next();
};