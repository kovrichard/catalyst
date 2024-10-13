import Joi from "joi";

const schema = Joi.object({
  logLevel: Joi.string().valid("error", "warn", "info", "debug").default("info"),
});

const conf = {
  logLevel: process.env.LOG_LEVEL,
};

const { error } = schema.validate(conf);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default conf;
