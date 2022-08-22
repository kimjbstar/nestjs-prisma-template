import { Cocktail, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { FindManyResult } from '@src/common/base.repository'
import { PrismaService } from '@src/modules/prisma/prisma.service'
import { CocktailListArgs } from './args/cocktail-list.args'
import { CocktailCreateDto } from './dtos/cocktail-create.dto'
import { CocktailUpdateDto } from './dtos/cocktail-update.dto'

@Injectable()
export class CocktailsService {
	constructor(
		private readonly prismaService: PrismaService
	) {}

	async findByPk(id: number): Promise<Cocktail> {
		return await this.prismaService.cocktail.findUnique({
		where: { id },
		});
	}

	async findFirst(args: Prisma.CocktailWhereInput): Promise<Cocktail> {
		return await this.prismaService.cocktail.findFirst({
		where: args,
		});
	}

	async create(dto: CocktailCreateDto): Promise<Cocktail> {
		return null
		/**
		return await this.prismaService.cocktail.create({
			data:{
				TO_DO
			}
		})
		*/
	}

	async update(dto: CocktailUpdateDto): Promise<Cocktail> {
		return null
		/**
		return await this.prismaService.cocktail.update({
			data:{
				TO_DO
			}
		})
		*/
	}

	async destroy(id: number) {
		return await this.prismaService.cocktail.delete({
			where: {
				id,
			},
		})
	}

	async findMany(args: CocktailListArgs): Promise<FindManyResult<Cocktail>> {
		const findManyArgs = await this.setFindManyArgs(args)
		const { where } = findManyArgs

		const items = await this.prismaService.cocktail.findMany(findManyArgs)
		const totalCount = await this.getCount(where)

		return {
			totalCount,
			items,
		}
	}

	async aggregate(args: CocktailListArgs) {
		const { where } = await this.setFindManyArgs(args)
		return await this.getAggregate(where)
	}

	async getAggregate(where: Prisma.CocktailWhereInput) {
		const fields: Prisma.CocktailCountAggregateInputType = {
			id: true,
		}
		return await this.prismaService.cocktail.aggregate({
			where,
			_count: { id: true },
			_sum: fields,
			_max: fields,
			_min: fields,
			_avg: fields,
		})
	}

	async getCount(where: Prisma.CocktailWhereInput) {
		return await this.prismaService.cocktail.count({ where })
	}

	async setFindManyArgs(
		args: CocktailListArgs,
	): Promise<Prisma.CocktailFindManyArgs> {
		const findManyArgs: Prisma.CocktailFindManyArgs = {
		}

		return this.prismaService.setOrderAndLimit(findManyArgs, args)
	}

}
