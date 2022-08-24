import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Mutation,
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
    private prismaService: PrismaService,
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

  @ResolveField()
  async glass(@Parent() cocktail: Cocktail, @Context() context) {
    return await this.prismaService.glass.findUnique({
      where: {
        id: cocktail.glassId,
      },
    });
  }

  @ResolveField()
  async techniques(@Parent() cocktail: Cocktail, @Context() context) {
    return await this.prismaService.technique.findMany({
      where: {
        cocktails: {
          some: {
            id: cocktail.id,
          },
        },
      },
    });
  }

  @ResolveField()
  async ingredients(@Parent() cocktail: Cocktail, @Context() context) {
    return await this.prismaService.ingredient.findMany({
      where: {
        cocktails: {
          some: {
            id: cocktail.id,
          },
        },
      },
    });
  }
}
