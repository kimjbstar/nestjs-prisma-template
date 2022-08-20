import { Prisma, Post } from ".prisma/client";
import { Injectable } from "@nestjs/common";
import { FindManyResult } from "@src/common/base.repository";
import { PrismaService } from "@src/modules/prisma/prisma.service";
import { PostListArgs } from "./args/post-list.args";

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByPk(id: number): Promise<Post> {
    return await this.prismaService.post.findUnique({
      where: { id },
    });
  }

  async findFirst(args: Prisma.PostWhereInput): Promise<Post> {
    return await this.prismaService.post.findFirst({
      where: args,
    });
  }

  async update(id: number, dto: any): Promise<Post> {
    const post = await this.findByPk(id);

    return await this.prismaService.post.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
      },
    });
  }

  async destroy(id: number) {
    const post = await this.findByPk(id);

    return await this.prismaService.post.delete({
      where: {
        id,
      },
    });
  }

  async findMany(args: PostListArgs): Promise<FindManyResult<Post>> {
    const items = await this.prismaService.post.findMany();
    const totalCount = await this.prismaService.post.count();

    return {
      totalCount,
      items,
    };
  }
}
