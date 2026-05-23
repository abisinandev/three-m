export interface ILogger {
  info(message: string | object): void;
  error(message: string | object): void;
  warn(message: string | object): void;
  debug(message: string | object): void;
}
