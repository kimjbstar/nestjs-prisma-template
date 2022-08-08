import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Author } from "@src/_gen/prisma-class/author";
import { Post } from "@src/_gen/prisma-class/post";
import { PrismaService } from "../prisma/prisma.service";
import { PostListArgs } from "./args/post-list.args";
import { PostsService } from "./posts.service";

@Resolver((of) => Post)
export class PostsResolver {
  constructor(
    private postsService: PostsService,
    private prismaService: PrismaService
  ) {}

  @Query((returns) => Post)
  async post(@Args("id", { type: () => String }) id: string) {
    return this.postsService.findByPk(id);
  }

  @Query((returns) => [Post])
  async posts(@Args() args: PostListArgs) {
    const posts = await this.prismaService.post.findMany({
      take: args.take,
    });
    return posts;
  }

  /** N:1 */
  @ResolveField()
  async author(@Parent() post: Post) {
    const author = await this.prismaService.author.findUnique({
      where: {
        id: post.authorId,
      },
    });
    return author;
  }
}
