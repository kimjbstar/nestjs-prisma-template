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
import { Cocktail } from "@src/_gen/prisma-class/cocktail";
import { PrismaService } from "../prisma/prisma.service";
import { CocktailListArgs } from "./args/cocktail-list.args";
import { CocktailsService } from "./cocktails.service";
import { CocktailCreateDto } from "./dtos/cocktail-create.dto";
import { CocktailUpdateDto } from "./dtos/cocktail-update.dto";
import { PaginatedCocktailResponse } from "./response/cocktail.response";

@Resolver((of) => Cocktail)
export class CocktailsResolver {
  constructor(
    private cocktailsService: CocktailsService,
    private prismaService: PrismaService
  ) {}

  @Query((returns) => Cocktail)
  async cocktail(@Args("id", { type: () => Int }) id: number) {
    return this.cocktailsService.findByPk(id);
  }

  @Query((returns) => PaginatedCocktailResponse)
  async cocktails(@Args() args: CocktailListArgs) {
    const { totalCount, items } = await this.cocktailsService.findMany(args);
    return {
      totalCount,
      items,
    };
  }

  @Mutation((returns) => Cocktail)
  async createCocktail(@Args("input") args: CocktailCreateDto) {
    return await this.cocktailsService.create(args);
  }

  @Mutation((returns) => Cocktail)
  async updateCocktail(@Args("input") args: CocktailUpdateDto) {
    return await this.cocktailsService.update(args);
  }

  /** N:1 */
  // @ResolveField()
  // async $!{PARENT_ENTITY}(@Parent() $!{CURRENT_ENTITY}: Cocktail) {
  //   const $!{PARENT_ENTITY} = await this.prismaService.$!{PARENT_ENTITY}.findUnique({
  //     where: {
  //       id: $!{CURRENT_ENTITY}.$!{PARENT_ENTITY}Id,
  //     },
  //   });
  //   return $!{PARENT_ENTITY};
  // }

  /** 1:N */
  // @ResolveField()
  // async $!{CHILD_ENTITIES}(@Parent() $!{CURRENT_ENTITY}: Cocktail, @Context() context) {
  //   return await this.prismaService.$!{CHILD_ENTITY}.findMany({
  //     where: {
  //       authorId: $!{CURRENT_ENTITY}.id,
  //     },
  //   });
  // }
}
