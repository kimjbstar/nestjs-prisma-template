import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces'
import * as Joi from 'joi'

const options: ConfigModuleOptions = {
	isGlobal: true,
	ignoreEnvVars: true,
	envFilePath: `.env.${process.env.NODE_ENV}`,
	validationSchema: Joi.object({
		NODE_ENV: Joi.string()
			.valid('development', 'staging', 'production', 'test', 'local')
			.default('development'),
		DATABASE_URL: Joi.string().required(),
		X_NCP_APIGW_API_KEY_ID: Joi.string().required(),
		X_NCP_APIGW_API_KEY: Joi.string().required(),
		X_NAVER_CLIENT_ID: Joi.string().required(),
		X_NAVER_CLIENT_SECRET: Joi.string().required(),
		POPBILL_SECRET_KEY: Joi.string().required(),
		REDIS_HOST: Joi.string().required(),
		REDIS_PORT: Joi.number().required(),
		REDIS_PASSWORD: Joi.string().optional(),
		VILLAGE_FORECAST_SERVICE_KEY: Joi.string().required(),
		SYNC_WORKER: Joi.boolean().optional(),
		APP_PORT: Joi.number().optional(),
		SESSION_SECRET: Joi.string().required(),
		RMQ_PRODUCER_URL: Joi.string().required(),
		RMQ_CONSUMER_URL: Joi.string().required(),
	}),
}

export default options
