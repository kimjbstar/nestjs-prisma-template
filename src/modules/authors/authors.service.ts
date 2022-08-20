import { Prisma, Author } from ".prisma/client";
import { Injectable } from "@nestjs/common";
import { FindManyResult } from "@src/common/base.repository";
import { PrismaService } from "@src/modules/prisma/prisma.service";
import { AuthorListArgs } from "./args/author-list.args";

@Injectable()
export class AuthorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByPk(id: number): Promise<Author> {
    return await this.prismaService.author.findUnique({
      where: { id },
    });
  }

  async findFirst(args: Prisma.AuthorWhereInput): Promise<Author> {
    return await this.prismaService.author.findFirst({
      where: args,
    });
  }

  async update(id: number, dto: any): Promise<Author> {
    const author = await this.findByPk(id);

    return await this.prismaService.author.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
      },
    });
  }

  async destroy(id: number) {
    const author = await this.findByPk(id);

    return await this.prismaService.author.delete({
      where: {
        id,
      },
    });
  }

  async findMany(args: AuthorListArgs): Promise<FindManyResult<Author>> {
    const findManyArgs = await this.setFindManyArgs(args);
    const { where } = findManyArgs;

    const items = await this.prismaService.author.findMany(findManyArgs);
    const totalCount = !args.after
      ? await this.prismaService.author.count({ where })
      : null;

    return {
      totalCount,
      items,
    };
  }

  async setFindManyArgs(
    args: AuthorListArgs
  ): Promise<Prisma.AuthorFindManyArgs> {
    const findManyArgs: Prisma.AuthorFindManyArgs = {
      where: {
        deletedAt: null,
      },
      orderBy: {},
    };
    return this.prismaService.setOrderAndLimit(findManyArgs, args);
  }
}
