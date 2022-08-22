import { Garnish, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { FindManyResult } from '@src/common/base.repository'
import { PrismaService } from '@src/modules/prisma/prisma.service'
import { GarnishListArgs } from './args/garnish-list.args'
import { GarnishCreateDto } from './dtos/garnish-create.dto'
import { GarnishUpdateDto } from './dtos/garnish-update.dto'

@Injectable()
export class GarnishesService {
	constructor(
		private readonly prismaService: PrismaService
	) {}

	async findByPk(id: number): Promise<Garnish> {
		return await this.prismaService.garnish.findUnique({
		where: { id },
		});
	}

	async findFirst(args: Prisma.GarnishWhereInput): Promise<Garnish> {
		return await this.prismaService.garnish.findFirst({
		where: args,
		});
	}

	async create(dto: GarnishCreateDto): Promise<Garnish> {
		return null
		/**
		return await this.prismaService.garnish.create({
			data:{
				TO_DO
			}
		})
		*/
	}

	async update(dto: GarnishUpdateDto): Promise<Garnish> {
		return null
		/**
		return await this.prismaService.garnish.update({
			data:{
				TO_DO
			}
		})
		*/
	}

	async destroy(id: number) {
		return await this.prismaService.garnish.delete({
			where: {
				id,
			},
		})
	}

	async findMany(args: GarnishListArgs): Promise<FindManyResult<Garnish>> {
		const findManyArgs = await this.setFindManyArgs(args)
		const { where } = findManyArgs

		const items = await this.prismaService.garnish.findMany(findManyArgs)
		const totalCount = await this.getCount(where)

		return {
			totalCount,
			items,
		}
	}

	async aggregate(args: GarnishListArgs) {
		const { where } = await this.setFindManyArgs(args)
		return await this.getAggregate(where)
	}

	async getAggregate(where: Prisma.GarnishWhereInput) {
		const fields: Prisma.GarnishCountAggregateInputType = {
			id: true,
		}
		return await this.prismaService.garnish.aggregate({
			where,
			_count: { id: true },
			_sum: fields,
			_max: fields,
			_min: fields,
			_avg: fields,
		})
	}

	async getCount(where: Prisma.GarnishWhereInput) {
		return await this.prismaService.garnish.count({ where })
	}

	async setFindManyArgs(
		args: GarnishListArgs,
	): Promise<Prisma.GarnishFindManyArgs> {
		const findManyArgs: Prisma.GarnishFindManyArgs = {
		}

		return this.prismaService.setOrderAndLimit(findManyArgs, args)
	}

}
