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
import { NormalResult, PaginatedResult } from "@src/common/dto/responses";
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

const URL_GLOBAL_PREFIX = "api";
const CURRENT_VERSION = process.env.npm_package_version;
const PORT = process.env.PORT || 5000;
const PROJECT_NAME = "nestjs-prisma-api-template";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const cacheConfigService = app.get<CacheConfigService>(CacheConfigService);
  const baseLoggerService = app.get<BaseLoggerService>(BaseLoggerService);
  const utilService = app.get<UtilService>(UtilService);
  const cachesService = app.get<CachesService>(CachesService);

  await cachesService.setDefault();

  app.setGlobalPrefix(URL_GLOBAL_PREFIX, {
    exclude: [
      {
        path: "health",
        method: RequestMethod.GET,
      },
    ],
  });
  app.useGlobalFilters(
    new CustomExceptionsFilter(utilService),
    new PrismaNotFoundErrorFilter(utilService),
    new PrismaClientKnownRequestErrorFilter(utilService),
    new PrismaClientValidationErrorFilter(utilService),
    new DefaultExceptionsFilter(utilService),
  );
  app.useGlobalInterceptors(
    new ParseInterceptor(),
    new LoggingInterceptor(baseLoggerService, utilService),
    new ErrorInterceptor(utilService),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // swagger
  const options = new DocumentBuilder()
    .setTitle(PROJECT_NAME)
    .setDescription(`${PROJECT_NAME} 문서 페이지입니다.`)
    .setContact(
      "kimjbtar",
      "https://www.github.com/kimjbstar",
      "kimjbstar@coderecipe.io",
    )
    .setVersion(CURRENT_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    extraModels: [PaginatedResult, NormalResult],
    deepScanRoutes: false,
  });
  SwaggerModule.setup(`${URL_GLOBAL_PREFIX}/doc`, app, document, {
    customSiteTitle: `${URL_GLOBAL_PREFIX} API 문서`,
    swaggerOptions: {
      tagsSorter: "alpha",
      operationsSorter: "alpha",
      defaultModelRendering: "model",
      filter: true,
    },
  });

  app.use(helmet());
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
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
