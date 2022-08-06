import { Module } from "@nestjs/common";
import { UsersService } from "@src/modules/users/users.service";
import { UsersController } from "./users.controller";
import { AuthModule } from "../auth/auth.module";

/**
 * ### 유저 모듈
 *
 * 로지파스타 유저 모듈입니다.
 *
 */
@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
