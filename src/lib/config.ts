import Joi from "joi";

const schema = Joi.object({
  logDrainUrl: Joi.string().default(false),
  logLevel: Joi.string().valid("error", "warn", "info", "debug").default("info"),
});

const envVars = {
  logDrainUrl: process.env.LOG_DRAIN_URL,
  logLevel: process.env.LOG_LEVEL,
};

const { error, value: conf } = schema.validate(envVars);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default conf;
