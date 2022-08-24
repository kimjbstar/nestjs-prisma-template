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
import { User } from "@src/_gen/prisma-class/user";
import { PrismaService } from "../prisma/prisma.service";
import { UserListArgs } from "./args/user-list.args";
import { UsersService } from "./users.service";
import { PaginatedUserResponse } from "./response/user.response";

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private prismaService: PrismaService,
  ) {}

  @Query((returns) => User)
  async user(@Args("id", { type: () => Int }) id: number) {
    return this.usersService.findByPk(id);
  }

  @Query((returns) => PaginatedUserResponse)
  async users(@Args() args: UserListArgs) {
    const { totalCount, items } = await this.usersService.findMany(args);
    return {
      totalCount,
      items,
    };
  }

  // @Mutation((returns) => User)
  // async createUser(@Args("input") args: UserCreateDto) {
  //   return await this.usersService.create(args);
  // }

  // @Mutation((returns) => User)
  // async updateUser(@Args("input") args: UserUpdateDto) {
  //   return await this.usersService.update(args);
  // }

  /** N:1 */
  // @ResolveField()
  // async $!{PARENT_ENTITY}(@Parent() $!{CURRENT_ENTITY}: User) {
  //   const $!{PARENT_ENTITY} = await this.prismaService.$!{PARENT_ENTITY}.findUnique({
  //     where: {
  //       id: $!{CURRENT_ENTITY}.$!{PARENT_ENTITY}Id,
  //     },
  //   });
  //   return $!{PARENT_ENTITY};
  // }

  /** 1:N */
  // @ResolveField()
  // async $!{CHILD_ENTITIES}(@Parent() $!{CURRENT_ENTITY}: User, @Context() context) {
  //   return await this.prismaService.$!{CHILD_ENTITY}.findMany({
  //     where: {
  //       authorId: $!{CURRENT_ENTITY}.id,
  //     },
  //   });
  // }
}
