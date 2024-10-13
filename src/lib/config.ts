import Joi from "joi";

const schema = Joi.object({
  logDrainUrl: Joi.string().default(false),
  logLevel: Joi.string().valid("error", "warn", "info", "debug").default("info"),
  frontendUrl: Joi.string().default("http://localhost:3000"),
});

const envVars = {
  logDrainUrl: process.env.LOG_DRAIN_URL,
  logLevel: process.env.LOG_LEVEL,
  frontendUrl: process.env.FRONTEND_URL,
};

const { error, value: conf } = schema.validate(envVars);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default conf;
