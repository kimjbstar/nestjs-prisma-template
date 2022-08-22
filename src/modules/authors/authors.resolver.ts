import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Mutation
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
  // @ResolveField()
  // async $!{PARENT_ENTITY}(@Parent() $!{CURRENT_ENTITY}: Author) {
  //   const $!{PARENT_ENTITY} = await this.prismaService.$!{PARENT_ENTITY}.findUnique({
  //     where: {
  //       id: $!{CURRENT_ENTITY}.$!{PARENT_ENTITY}Id,
  //     },
  //   });
  //   return $!{PARENT_ENTITY};
  // }

  /** 1:N */
  // @ResolveField()
  // async $!{CHILD_ENTITIES}(@Parent() $!{CURRENT_ENTITY}: Author, @Context() context) {
  //   return await this.prismaService.$!{CHILD_ENTITY}.findMany({
  //     where: {
  //       authorId: $!{CURRENT_ENTITY}.id,
  //     },
  //   });
  // }
}
