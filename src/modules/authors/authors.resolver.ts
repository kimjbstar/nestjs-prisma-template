import {
  Args,
  Context,
  Int,
  ObjectType,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { CurrentGraphQLContext } from "@src/common/decorators/current-context";
import PaginatedResponse from "@src/common/dto/responses";
import { Author } from "@src/_gen/prisma-class/author";
import { PostsService } from "../posts/posts.service";
import { PrismaService } from "../prisma/prisma.service";
import { AuthorListArgs } from "./args/author-list.args";
import { AuthorsService } from "./authors.service";

@ObjectType()
class PaginatedAuthorResponse extends PaginatedResponse(Author) {}

@Resolver((of) => Author)
export class AuthorsResolver {
  constructor(
    private authorsService: AuthorsService,
    private postsService: PostsService,
    private prismaService: PrismaService
  ) {}

  @Query((returns) => Author)
  async author(@Args("id", { type: () => Int }) id: number) {
    return this.authorsService.findByPk(id);
  }

  @Query((returns) => PaginatedAuthorResponse)
  async authors(@Args() args: AuthorListArgs) {
    const { totalCount, items } = await this.authorsService.findMany(args);
    return {
      totalCount,
      items,
    };
  }

  /** N:1 */
  @ResolveField()
  async company(@Parent() author: Author) {
    const company = await this.prismaService.company.findUnique({
      where: {
        id: author.companyId,
      },
    });
    return company;
  }

  /** 1:N */
  @ResolveField()
  async posts(@Parent() author: Author, @Context() context) {
    console.log("context in author->posts", context);
    return await this.prismaService.post.findMany({
      where: {
        authorId: author.id,
      },
    });
  }
}
