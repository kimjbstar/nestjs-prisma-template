import { Glass, Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { FindManyResult } from "@src/common/base.repository";
import { PrismaService } from "@src/modules/prisma/prisma.service";
import { GlassListArgs } from "./args/glass-list.args";
import { GlassCreateDto } from "./dtos/glass-create.dto";
import { GlassUpdateDto } from "./dtos/glass-update.dto";

@Injectable()
export class GlassesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByPk(id: number): Promise<Glass> {
    return await this.prismaService.glass.findUnique({
      where: { id },
    });
  }

  async findFirst(args: Prisma.GlassWhereInput): Promise<Glass> {
    return await this.prismaService.glass.findFirst({
      where: args,
    });
  }

  async create(dto: GlassCreateDto): Promise<Glass> {
    return await this.prismaService.glass.create({
      data: {
        name: dto.name,
        nameEnglish: dto.name_english,
        volume: dto.volume,
      },
    });
  }

  async update(dto: GlassUpdateDto): Promise<Glass> {
    return await this.prismaService.glass.update({
      where: {
        id: dto.id,
      },
      data: {
        name: dto.name,
        nameEnglish: dto.name_english,
        volume: dto.volume,
      },
    });
  }

  async destroy(id: number) {
    return await this.prismaService.glass.delete({
      where: {
        id,
      },
    });
  }

  async findMany(args: GlassListArgs): Promise<FindManyResult<Glass>> {
    const findManyArgs = await this.setFindManyArgs(args);
    const { where } = findManyArgs;

    const items = await this.prismaService.glass.findMany(findManyArgs);
    const totalCount = await this.getCount(where);

    return {
      totalCount,
      items,
    };
  }

  async aggregate(args: GlassListArgs) {
    const { where } = await this.setFindManyArgs(args);
    return await this.getAggregate(where);
  }

  async getAggregate(where: Prisma.GlassWhereInput) {
    const fields: Prisma.GlassCountAggregateInputType = {
      id: true,
    };
    return await this.prismaService.glass.aggregate({
      where,
      _count: { id: true },
      _sum: fields,
      _max: fields,
      _min: fields,
      _avg: fields,
    });
  }

  async getCount(where: Prisma.GlassWhereInput) {
    return await this.prismaService.glass.count({ where });
  }

  async setFindManyArgs(
    args: GlassListArgs,
  ): Promise<Prisma.GlassFindManyArgs> {
    const findManyArgs: Prisma.GlassFindManyArgs = {};

    return this.prismaService.setOrderAndLimit(findManyArgs, args);
  }
}
