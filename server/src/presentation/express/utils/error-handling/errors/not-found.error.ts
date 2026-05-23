import { HttpStatus } from "@domain/enum/express/status-code";
import { BaseError } from "../base-error";

/** 404 - resource not found */
export class NotFoundError extends BaseError {
  constructor(description = "Resource not found") {
    super("NotFoundError", HttpStatus.NOT_FOUND, true, description);
  }
}
