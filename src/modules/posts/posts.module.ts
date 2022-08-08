import { Module } from "@nestjs/common";
import { PostsService } from "@src/modules/posts/posts.service";
import { PostsResolver } from "./posts.resolver";

/**
 * ### 유저 모듈
 *
 * 로지파스타 유저 모듈입니다.
 *
 */
@Module({
  imports: [],
  controllers: [],
  providers: [PostsService, PostsResolver],
  exports: [PostsService, PostsResolver],
})
export class PostsModule {}
