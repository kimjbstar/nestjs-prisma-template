import { Prisma, Author } from ".prisma/client";
import { Injectable } from "@nestjs/common";
import { FindManyResult } from "@src/common/base.repository";
import { PrismaService } from "@src/modules/prisma/prisma.service";
import { AuthorListArgs } from "./args/author-list.args";

@Injectable()
export class AuthorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByPk(id: string): Promise<Author> {
    return await this.prismaService.author.findUnique({
      where: { id },
    });
  }

  async findFirst(args: Prisma.AuthorWhereInput): Promise<Author> {
    return await this.prismaService.author.findFirst({
      where: args,
    });
  }

  async update(id: string, dto: any): Promise<Author> {
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

  async destroy(id: string) {
    const author = await this.findByPk(id);

    return await this.prismaService.author.delete({
      where: {
        id,
      },
    });
  }

  async findMany(args: AuthorListArgs): Promise<FindManyResult<Author>> {
    const list = await this.prismaService.author.findMany();
    const totalCount = await this.prismaService.author.count();

    return {
      totalCount,
      list,
    };
  }
}
