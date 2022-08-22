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
import { Recipe } from "@src/_gen/prisma-class/recipe";
import { PrismaService } from "../prisma/prisma.service";
import { RecipeListArgs } from "./args/recipe-list.args";
import { RecipesService } from "./recipes.service";
import { RecipeCreateDto } from "./dtos/recipe-create.dto";
import { RecipeUpdateDto } from "./dtos/recipe-update.dto";
import { PaginatedRecipeResponse } from "./response/recipe.response";

@Resolver((of) => Recipe)
export class RecipesResolver {
  constructor(
    private recipesService: RecipesService,
    private prismaService: PrismaService
  ) {}

  @Query((returns) => Recipe)
  async recipe(@Args("id", { type: () => Int }) id: number) {
    return this.recipesService.findByPk(id);
  }

  @Query((returns) => PaginatedRecipeResponse)
  async recipes(@Args() args: RecipeListArgs) {
    const { totalCount, items } = await this.recipesService.findMany(args);
    return {
      totalCount,
      items,
    };
  }

  @Mutation((returns) => Recipe)
  async createRecipe(@Args("input") args: RecipeCreateDto) {
    return await this.recipesService.create(args);
  }

  @Mutation((returns) => Recipe)
  async updateRecipe(@Args("input") args: RecipeUpdateDto) {
    return await this.recipesService.update(args);
  }

  /** N:1 */
  // @ResolveField()
  // async $!{PARENT_ENTITY}(@Parent() $!{CURRENT_ENTITY}: Recipe) {
  //   const $!{PARENT_ENTITY} = await this.prismaService.$!{PARENT_ENTITY}.findUnique({
  //     where: {
  //       id: $!{CURRENT_ENTITY}.$!{PARENT_ENTITY}Id,
  //     },
  //   });
  //   return $!{PARENT_ENTITY};
  // }

  /** 1:N */
  // @ResolveField()
  // async $!{CHILD_ENTITIES}(@Parent() $!{CURRENT_ENTITY}: Recipe, @Context() context) {
  //   return await this.prismaService.$!{CHILD_ENTITY}.findMany({
  //     where: {
  //       authorId: $!{CURRENT_ENTITY}.id,
  //     },
  //   });
  // }
}
