import { HttpStatus } from "@domain/enum/express/status-code";
import { BaseError } from "../base-error";

/** 500 - unexpected system failure */
export class InternalServerError extends BaseError {
  constructor(description = "Internal server error") {
    super(
      "InternalServerError",
      HttpStatus.INTERNAL_SERVER_ERROR,
      false,
      description,
    );
  }
}
