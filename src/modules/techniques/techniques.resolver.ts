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
import { Technique } from "@src/_gen/prisma-class/technique";
import { PrismaService } from "../prisma/prisma.service";
import { TechniqueListArgs } from "./args/technique-list.args";
import { TechniquesService } from "./techniques.service";
import { TechniqueCreateDto } from "./dtos/technique-create.dto";
import { TechniqueUpdateDto } from "./dtos/technique-update.dto";
import { PaginatedTechniqueResponse } from "./response/technique.response";

@Resolver((of) => Technique)
export class TechniquesResolver {
  constructor(
    private techniquesService: TechniquesService,
    private prismaService: PrismaService
  ) {}

  @Query((returns) => Technique)
  async technique(@Args("id", { type: () => Int }) id: number) {
    return this.techniquesService.findByPk(id);
  }

  @Query((returns) => PaginatedTechniqueResponse)
  async techniques(@Args() args: TechniqueListArgs) {
    const { totalCount, items } = await this.techniquesService.findMany(args);
    return {
      totalCount,
      items,
    };
  }

  @Mutation((returns) => Technique)
  async createTechnique(@Args("input") args: TechniqueCreateDto) {
    return await this.techniquesService.create(args);
  }

  @Mutation((returns) => Technique)
  async updateTechnique(@Args("input") args: TechniqueUpdateDto) {
    return await this.techniquesService.update(args);
  }

  /** N:1 */
  // @ResolveField()
  // async $!{PARENT_ENTITY}(@Parent() $!{CURRENT_ENTITY}: Technique) {
  //   const $!{PARENT_ENTITY} = await this.prismaService.$!{PARENT_ENTITY}.findUnique({
  //     where: {
  //       id: $!{CURRENT_ENTITY}.$!{PARENT_ENTITY}Id,
  //     },
  //   });
  //   return $!{PARENT_ENTITY};
  // }

  /** 1:N */
  // @ResolveField()
  // async $!{CHILD_ENTITIES}(@Parent() $!{CURRENT_ENTITY}: Technique, @Context() context) {
  //   return await this.prismaService.$!{CHILD_ENTITY}.findMany({
  //     where: {
  //       authorId: $!{CURRENT_ENTITY}.id,
  //     },
  //   });
  // }
}
