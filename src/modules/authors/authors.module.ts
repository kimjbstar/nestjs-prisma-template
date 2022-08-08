import { Module } from "@nestjs/common";
import { AuthorsService } from "@src/modules/authors/authors.service";
import { AuthModule } from "../auth/auth.module";
import { PostsService } from "../posts/posts.service";
import { AuthorsResolver } from "./authors.resolver";

/**
 * ### 유저 모듈
 *
 * 로지파스타 유저 모듈입니다.
 *
 */
@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [AuthorsService, AuthorsResolver, PostsService],
  exports: [AuthorsService, AuthorsResolver],
})
export class AuthorsModule {}
