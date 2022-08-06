import { Prisma, User } from ".prisma/client";
import { Injectable } from "@nestjs/common";
import { FindManyResult } from "@src/common/base.repository";
import { PrismaService } from "@src/modules/prisma/prisma.service";
import { UserListArgs } from "./args/user-list.args";
import { AuthService, SessionUser } from "../auth/auth.service";
import { CustomException } from "@src/common/exceptions/filters/custom.exception-filters";

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService
  ) {}

  async findByPk(id: string): Promise<User> {
    return await this.prismaService.findUniqueUser(id);
  }

  async findFirst(args: Prisma.UserWhereInput, reject = false): Promise<User> {
    return await this.prismaService.findFirstUser(args, reject);
  }

  async update(id: string, dto: any): Promise<User> {
    const user = await this.findByPk(id);

    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
      },
    });
  }

  async destroy(id: string) {
    const user = await this.findByPk(id);

    return await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  async findMany(args: UserListArgs): Promise<FindManyResult<User>> {
    const findManyArgs = this._setFindManyArgs(args);
    const { where } = findManyArgs;

    const list = await this.prismaService.user.findMany(findManyArgs);
    const totalCount = await this.getCount(where);

    return {
      totalCount,
      list,
    };
  }

  async aggregate(args: UserListArgs) {
    const { where } = this._setFindManyArgs(args);
    return await this.getAggregate(where);
  }

  /** 세션 저장 정보 화이트리스팅 */
  summarize(user: Partial<User>): SessionUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async getAggregate(where: Prisma.UserWhereInput) {
    const fields: Prisma.UserCountAggregateInputType = {
      id: true,
    };
    return await this.prismaService.user.aggregate({
      where,
      _count: { id: true },
      _max: fields,
      _min: fields,
    });
  }

  async getCount(where: Prisma.UserWhereInput) {
    return await this.prismaService.user.count({ where });
  }

  _setFindManyArgs(args: UserListArgs): Prisma.UserFindManyArgs {
    const findManyArgs: Prisma.UserFindManyArgs = {
      where: {},
      orderBy: {},
    };

    return this.prismaService.setOrderAndLimit(findManyArgs, args);
  }

  async login(input: { email: string; password: string }) {
    const { email, password } = input;
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new CustomException({
        code: "LOGIN_FAIL_EMAIL",
      });
    }

    const hashed = await this.authService.pbkdf2(user.salt, password);
    if (hashed !== user.password) {
      throw new CustomException({
        code: "LOGIN_FAIL_PASSWORD",
      });
    }
    return user;
  }
}
