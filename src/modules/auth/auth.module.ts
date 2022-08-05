import { Module } from "@nestjs/common";
import { AuthController } from "@src/modules/auth/auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SlackService } from "../slack/slack.service";

/**
 * ### 인증 로직 담당 모듈
 *
 * 암호화, 세션 관리 등을 담당하는 모듈입니다.
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>("SESSION_SECRET"),
          signOptions: { expiresIn: "24h" },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SlackService],
  exports: [AuthService],
})
export class AuthModule {}
