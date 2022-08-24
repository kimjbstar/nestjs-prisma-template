import { Module } from "@nestjs/common";
import { UsersService } from "@src/modules/users/users.service";
import { AuthModule } from "../auth/auth.module";
import { UsersResolver } from "./users.resolver";

/**
 * ### 유저 모듈
 *
 * 로지파스타 유저 모듈입니다.
 *
 */
@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [UsersService, UsersResolver],
  exports: [UsersService, UsersResolver],
})
export class UsersModule {}
