import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth/auth.service";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";
import { SlackService } from "../slack/slack.service";
import { UtilService } from "../util/util.service";
import { SeedService } from "./seed.service";

/**
 * ### seed 모듈
 *
 * seed 모듈입니다.
 *
 */
@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    SeedService,
    PrismaService,
    AuthService,
    UtilService,
    ConfigService,
    SlackService,
  ],
  exports: [SeedService],
})
export class SeedModule {}
