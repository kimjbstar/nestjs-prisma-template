import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Author } from "@src/_gen/prisma-class/author";
import { PrismaService } from "../prisma/prisma.service";
import { AuthorListArgs } from "./args/author-list.args";
import { AuthorsService } from "./authors.service";
import { AuthorCreateDto } from "./dtos/author-create.dto";
import { AuthorUpdateDto } from "./dtos/author-update.dto";
import { PaginatedAuthorResponse } from "./response/author.response";

@Resolver((of) => Author)
export class AuthorsResolver {
  constructor(
    private authorsService: AuthorsService,
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

  @Mutation((returns) => Author)
  async createAuthor(@Args("input") args: AuthorCreateDto) {
    return await this.authorsService.create(args);
  }

  @Mutation((returns) => Author)
  async updateAuthor(@Args("input") args: AuthorUpdateDto) {
    return await this.authorsService.update(args);
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
    return await this.prismaService.post.findMany({
      where: {
        authorId: author.id,
      },
    });
  }
}
