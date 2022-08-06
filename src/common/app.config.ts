import { ConfigModuleOptions } from "@nestjs/config";
import * as Joi from "joi";

const options: ConfigModuleOptions = {
  isGlobal: true,
  ignoreEnvVars: true,
  envFilePath: `.env.${process.env.NODE_ENV}`,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid("development", "staging", "production", "test", "local")
      .default("development"),
    DATABASE_URL: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_PASSWORD: Joi.string().optional(),
    SESSION_SECRET: Joi.string().required(),
  }),
};

export default options;
