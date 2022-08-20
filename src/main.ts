import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import connectRedis from "connect-redis";
import { json, urlencoded } from "express";
import session from "express-session";
import helmet from "helmet";
import "module-alias/register";
import "reflect-metadata";
import { NormalResult } from "@src/common/dto/responses";
import { CustomExceptionsFilter } from "@src/common/exceptions/filters/custom.exception-filters";
import { PrismaNotFoundErrorFilter } from "@src/common/exceptions/filters/prisma-not-found.exception-filters";
import { LoggingInterceptor } from "@src/interceptors/logging.interceptor";
import { ParseInterceptor } from "@src/interceptors/parser.interceptor";
import { CachesService } from "@src/modules/caches/caches.service";
import { BaseLoggerService } from "@src/modules/base-logger/base-logger.service";
import { CacheConfigService } from "@src/modules/caches/cache-config.service";
import { UtilService } from "@src/modules/util/util.service";
import { AppModule } from "@src/app.module";
import { ErrorInterceptor } from "@src/interceptors/error.interceptor";
import { DefaultExceptionsFilter } from "@src/common/exceptions/filters/default.exception-filters";
import { PrismaClientKnownRequestErrorFilter } from "@src/common/exceptions/filters/prisma-client-known-request.exception-filters";
import { PrismaClientValidationErrorFilter } from "@src/common/exceptions/filters/prisma-client-validation.exception-filters";

const CURRENT_VERSION = process.env.npm_package_version;
const PORT = process.env.PORT || 5000;
// FIXME: 프로젝트명
const PROJECT_NAME = "nestjs-prisma-api-template";
const UPLOAD_LIMIT = "50mb";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const cacheConfigService = app.get<CacheConfigService>(CacheConfigService);
  const baseLoggerService = app.get<BaseLoggerService>(BaseLoggerService);
  const utilService = app.get<UtilService>(UtilService);
  const cachesService = app.get<CachesService>(CachesService);

  await cachesService.setDefault();

  app.useGlobalFilters(
    new CustomExceptionsFilter(utilService),
    new PrismaNotFoundErrorFilter(utilService),
    new PrismaClientKnownRequestErrorFilter(utilService),
    new PrismaClientValidationErrorFilter(utilService),
    new DefaultExceptionsFilter(utilService)
  );
  app.useGlobalInterceptors(
    // new ParseInterceptor(),
    // new LoggingInterceptor(baseLoggerService, utilService),
    new ErrorInterceptor(utilService)
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  // app.use(helmet());
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV !== "local" ? undefined : false,
    })
  );
  app.use(json({ limit: UPLOAD_LIMIT }));
  app.use(urlencoded({ extended: true, limit: UPLOAD_LIMIT }));
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: [
      "Origin",
      "Accept",
      "X-Requested-With",
      "Content-Type",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
      "Authorization",
    ],
    optionsSuccessStatus: 204,
  });

  // session
  const RedisStore = connectRedis(session);
  const sessionOption: session.SessionOptions = {
    secret: configService.get<string>("SESSION_SECRET"),
    resave: false,
    saveUninitialized: false,
    store: undefined,
    cookie: {
      httpOnly: false,
    },
  };
  if (cacheConfigService.client) {
    sessionOption.store = new RedisStore({
      client: cacheConfigService.client,
      ttl: 24 * 60 * 60,
    });
  }
  app.use(session(sessionOption));
  await app.listen(PORT);
}

bootstrap();
