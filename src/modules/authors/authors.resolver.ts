import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Author } from "@src/_gen/prisma-class/author";
import { PostsService } from "../posts/posts.service";
import { PrismaService } from "../prisma/prisma.service";
import { AuthorListArgs } from "./args/author-list.args";
import { AuthorsService } from "./authors.service";

@Resolver((of) => Author)
export class AuthorsResolver {
  constructor(
    private authorsService: AuthorsService,
    private postsService: PostsService,
    private prismaService: PrismaService
  ) {}

  @Query((returns) => Author)
  async author(@Args("id", { type: () => String }) id: string) {
    return this.authorsService.findByPk(id);
  }

  @Query((returns) => [Author])
  async authors(@Args() args: AuthorListArgs, @Context() context) {
    const authors = await this.prismaService.author.findMany({
      where: {
        name: args.name ?? undefined,
      },
      take: args.take,
    });
    return authors;
  }

  /** 1:N */
  @ResolveField()
  async posts(@Parent() author: Author) {
    const { id } = author;
    return await this.prismaService.post.findMany({
      where: {
        authorId: author.id,
      },
    });
  }
}
