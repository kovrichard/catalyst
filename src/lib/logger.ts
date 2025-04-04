import winston from "winston";
import Transport from "winston-transport";
import conf from "./config";

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

    await fetch(conf.logDrainUrl, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    callback();
  }
}

const transports: Transport[] = [
  new winston.transports.Console({ format: winston.format.simple() }),
];

if (conf.logDrainUrl) {
  transports.push(new CustomTransport({}));
}

export const logger = winston.createLogger({
  level: conf.logLevel,
  format: winston.format.json(),
  transports: transports,
});
