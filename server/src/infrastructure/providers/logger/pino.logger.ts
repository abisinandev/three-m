import pino from "pino";

export const logger = pino({
  level: "info",
  transport: {
    targets: [
      {
        target: "pino-pretty",
        level: "info",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss",
          // messageFormat: "{msg}",
          // charset: "utf8",
        },
      },

      // {
      //   target: "pino/file",
      //   level: "error",
      //   options: {
      //     destination: "logs/error.log",
      //     mkdir: true,
      //   },
      // },

      // {
      //   target: "pino/file",
      //   level: "info",
      //   options: {
      //     destination: "logs/combined.log",
      //     mkdir: true,
      //   },
      // },
    ],
  },
});
