import { HttpStatus } from "@domain/enum/express/status-code";
import { BaseError } from "../base-error";

/** 503 - external service down or unavailable */
export class ServiceUnavailableError extends BaseError {
  constructor(description = "Service unavailable") {
    super(
      "ServiceUnavailableError",
      HttpStatus.SERVICE_UNAVAILABLE,
      false,
      description,
    );
  }
}
