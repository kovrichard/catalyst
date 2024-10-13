import winston from "winston";
import Transport from "winston-transport";
import conf from "./config";

// biome-ignore lint/correctness/noUnusedVariables: Used if log drain is enabled
class CustomTransport extends Transport {
  constructor(opts: Transport.TransportStreamOptions) {
    super(opts);
  }

  async log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const body = {
      name: "Catalyst",
      level: info.level,
      context: {},
      message: info.message,
      stack: info.stack,
    };

    await fetch("<LOG-DRAIN-URL-HERE>", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    callback();
  }
}

export const logger = winston.createLogger({
  level: conf.logLevel,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    // new CustomTransport({}),
  ],
});
