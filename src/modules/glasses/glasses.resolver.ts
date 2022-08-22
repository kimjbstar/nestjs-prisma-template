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
import { Glass } from "@src/_gen/prisma-class/glass";
import { PrismaService } from "../prisma/prisma.service";
import { GlassListArgs } from "./args/glass-list.args";
import { GlassesService } from "./glasses.service";
import { GlassCreateDto } from "./dtos/glass-create.dto";
import { GlassUpdateDto } from "./dtos/glass-update.dto";
import { PaginatedGlassResponse } from "./response/glass.response";

@Resolver((of) => Glass)
export class GlassesResolver {
  constructor(
    private glassesService: GlassesService,
    private prismaService: PrismaService
  ) {}

  @Query((returns) => Glass)
  async glass(@Args("id", { type: () => Int }) id: number) {
    return this.glassesService.findByPk(id);
  }

  @Query((returns) => PaginatedGlassResponse)
  async glasses(@Args() args: GlassListArgs) {
    const { totalCount, items } = await this.glassesService.findMany(args);
    return {
      totalCount,
      items,
    };
  }

  @Mutation((returns) => Glass)
  async createGlass(@Args("input") args: GlassCreateDto) {
    return await this.glassesService.create(args);
  }

  @Mutation((returns) => Glass)
  async updateGlass(@Args("input") args: GlassUpdateDto) {
    return await this.glassesService.update(args);
  }

  /** N:1 */
  // @ResolveField()
  // async $!{PARENT_ENTITY}(@Parent() $!{CURRENT_ENTITY}: Glass) {
  //   const $!{PARENT_ENTITY} = await this.prismaService.$!{PARENT_ENTITY}.findUnique({
  //     where: {
  //       id: $!{CURRENT_ENTITY}.$!{PARENT_ENTITY}Id,
  //     },
  //   });
  //   return $!{PARENT_ENTITY};
  // }

  /** 1:N */
  // @ResolveField()
  // async $!{CHILD_ENTITIES}(@Parent() $!{CURRENT_ENTITY}: Glass, @Context() context) {
  //   return await this.prismaService.$!{CHILD_ENTITY}.findMany({
  //     where: {
  //       authorId: $!{CURRENT_ENTITY}.id,
  //     },
  //   });
  // }
}
