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
import { Ingredient } from "@src/_gen/prisma-class/ingredient";
import { PrismaService } from "../prisma/prisma.service";
import { IngredientListArgs } from "./args/ingredient-list.args";
import { IngredientsService } from "./ingredients.service";
import { IngredientCreateDto } from "./dtos/ingredient-create.dto";
import { IngredientUpdateDto } from "./dtos/ingredient-update.dto";
import { PaginatedIngredientResponse } from "./response/ingredient.response";

@Resolver((of) => Ingredient)
export class IngredientsResolver {
  constructor(
    private ingredientsService: IngredientsService,
    private prismaService: PrismaService
  ) {}

  @Query((returns) => Ingredient)
  async ingredient(@Args("id", { type: () => Int }) id: number) {
    return this.ingredientsService.findByPk(id);
  }

  @Query((returns) => PaginatedIngredientResponse)
  async ingredients(@Args() args: IngredientListArgs) {
    const { totalCount, items } = await this.ingredientsService.findMany(args);
    return {
      totalCount,
      items,
    };
  }

  @Mutation((returns) => Ingredient)
  async createIngredient(@Args("input") args: IngredientCreateDto) {
    return await this.ingredientsService.create(args);
  }

  @Mutation((returns) => Ingredient)
  async updateIngredient(@Args("input") args: IngredientUpdateDto) {
    return await this.ingredientsService.update(args);
  }

  /** N:1 */
  // @ResolveField()
  // async $!{PARENT_ENTITY}(@Parent() $!{CURRENT_ENTITY}: Ingredient) {
  //   const $!{PARENT_ENTITY} = await this.prismaService.$!{PARENT_ENTITY}.findUnique({
  //     where: {
  //       id: $!{CURRENT_ENTITY}.$!{PARENT_ENTITY}Id,
  //     },
  //   });
  //   return $!{PARENT_ENTITY};
  // }

  /** 1:N */
  // @ResolveField()
  // async $!{CHILD_ENTITIES}(@Parent() $!{CURRENT_ENTITY}: Ingredient, @Context() context) {
  //   return await this.prismaService.$!{CHILD_ENTITY}.findMany({
  //     where: {
  //       authorId: $!{CURRENT_ENTITY}.id,
  //     },
  //   });
  // }
}
