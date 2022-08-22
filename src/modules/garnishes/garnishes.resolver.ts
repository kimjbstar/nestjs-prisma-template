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
import { Garnish } from "@src/_gen/prisma-class/garnish";
import { PrismaService } from "../prisma/prisma.service";
import { GarnishListArgs } from "./args/garnish-list.args";
import { GarnishesService } from "./garnishes.service";
import { GarnishCreateDto } from "./dtos/garnish-create.dto";
import { GarnishUpdateDto } from "./dtos/garnish-update.dto";
import { PaginatedGarnishResponse } from "./response/garnish.response";

@Resolver((of) => Garnish)
export class GarnishesResolver {
  constructor(
    private garnishesService: GarnishesService,
    private prismaService: PrismaService
  ) {}

  @Query((returns) => Garnish)
  async garnish(@Args("id", { type: () => Int }) id: number) {
    return this.garnishesService.findByPk(id);
  }

  @Query((returns) => PaginatedGarnishResponse)
  async garnishes(@Args() args: GarnishListArgs) {
    const { totalCount, items } = await this.garnishesService.findMany(args);
    return {
      totalCount,
      items,
    };
  }

  @Mutation((returns) => Garnish)
  async createGarnish(@Args("input") args: GarnishCreateDto) {
    return await this.garnishesService.create(args);
  }

  @Mutation((returns) => Garnish)
  async updateGarnish(@Args("input") args: GarnishUpdateDto) {
    return await this.garnishesService.update(args);
  }

  /** N:1 */
  // @ResolveField()
  // async $!{PARENT_ENTITY}(@Parent() $!{CURRENT_ENTITY}: Garnish) {
  //   const $!{PARENT_ENTITY} = await this.prismaService.$!{PARENT_ENTITY}.findUnique({
  //     where: {
  //       id: $!{CURRENT_ENTITY}.$!{PARENT_ENTITY}Id,
  //     },
  //   });
  //   return $!{PARENT_ENTITY};
  // }

  /** 1:N */
  // @ResolveField()
  // async $!{CHILD_ENTITIES}(@Parent() $!{CURRENT_ENTITY}: Garnish, @Context() context) {
  //   return await this.prismaService.$!{CHILD_ENTITY}.findMany({
  //     where: {
  //       authorId: $!{CURRENT_ENTITY}.id,
  //     },
  //   });
  // }
}
