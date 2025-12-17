import { ILogger } from "./logger.interface";
import { logger } from "./pino.logger";

export class PinoLoggerService implements ILogger {
  info(message: string | object): void {
    logger.info(message);
  }
  error(message: string | object): void {
    logger.error(message);
  }
  warn(message: string | object): void {
    logger.warn(message);
  }
  debug(message: string | object): void {
    logger.debug(message);
  }
}
