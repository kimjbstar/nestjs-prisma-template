import { Technique, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { FindManyResult } from '@src/common/base.repository'
import { PrismaService } from '@src/modules/prisma/prisma.service'
import { TechniqueListArgs } from './args/technique-list.args'
import { TechniqueCreateDto } from './dtos/technique-create.dto'
import { TechniqueUpdateDto } from './dtos/technique-update.dto'

@Injectable()
export class TechniquesService {
	constructor(
		private readonly prismaService: PrismaService
	) {}

	async findByPk(id: number): Promise<Technique> {
		return await this.prismaService.technique.findUnique({
		where: { id },
		});
	}

	async findFirst(args: Prisma.TechniqueWhereInput): Promise<Technique> {
		return await this.prismaService.technique.findFirst({
		where: args,
		});
	}

	async create(dto: TechniqueCreateDto): Promise<Technique> {
		return null
		/**
		return await this.prismaService.technique.create({
			data:{
				TO_DO
			}
		})
		*/
	}

	async update(dto: TechniqueUpdateDto): Promise<Technique> {
		return null
		/**
		return await this.prismaService.technique.update({
			data:{
				TO_DO
			}
		})
		*/
	}

	async destroy(id: number) {
		return await this.prismaService.technique.delete({
			where: {
				id,
			},
		})
	}

	async findMany(args: TechniqueListArgs): Promise<FindManyResult<Technique>> {
		const findManyArgs = await this.setFindManyArgs(args)
		const { where } = findManyArgs

		const items = await this.prismaService.technique.findMany(findManyArgs)
		const totalCount = await this.getCount(where)

		return {
			totalCount,
			items,
		}
	}

	async aggregate(args: TechniqueListArgs) {
		const { where } = await this.setFindManyArgs(args)
		return await this.getAggregate(where)
	}

	async getAggregate(where: Prisma.TechniqueWhereInput) {
		const fields: Prisma.TechniqueCountAggregateInputType = {
			id: true,
		}
		return await this.prismaService.technique.aggregate({
			where,
			_count: { id: true },
			_sum: fields,
			_max: fields,
			_min: fields,
			_avg: fields,
		})
	}

	async getCount(where: Prisma.TechniqueWhereInput) {
		return await this.prismaService.technique.count({ where })
	}

	async setFindManyArgs(
		args: TechniqueListArgs,
	): Promise<Prisma.TechniqueFindManyArgs> {
		const findManyArgs: Prisma.TechniqueFindManyArgs = {
		}

		return this.prismaService.setOrderAndLimit(findManyArgs, args)
	}

}
