import ConfigModuleOptions from "@src/common/app.config";
import { BaseLoggerModule } from "./modules/base-logger/base-logger.module";
import { UtilModule } from "./modules/util/util.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { SlackModule } from "./modules/slack/slack.module";
import { ConfigModule } from "@nestjs/config";
import { CachesModule } from "./modules/caches/caches.module";
import { TestingModuleBuilder } from "@nestjs/testing";

export const GlobalModules = [
  ConfigModule.forRoot(ConfigModuleOptions),
  BaseLoggerModule,
  CachesModule,
  SlackModule,
  UtilModule,
  PrismaModule,
];

export function mockThirdParty(
  builder: TestingModuleBuilder
): TestingModuleBuilder {
  return builder;
  // .overrideProvider(NaverService)
  // .useClass(NaverServiceMock)
}
