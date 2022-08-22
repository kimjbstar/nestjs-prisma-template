import { Ingredient, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { FindManyResult } from '@src/common/base.repository'
import { PrismaService } from '@src/modules/prisma/prisma.service'
import { IngredientListArgs } from './args/ingredient-list.args'
import { IngredientCreateDto } from './dtos/ingredient-create.dto'
import { IngredientUpdateDto } from './dtos/ingredient-update.dto'

@Injectable()
export class IngredientsService {
	constructor(
		private readonly prismaService: PrismaService
	) {}

	async findByPk(id: number): Promise<Ingredient> {
		return await this.prismaService.ingredient.findUnique({
		where: { id },
		});
	}

	async findFirst(args: Prisma.IngredientWhereInput): Promise<Ingredient> {
		return await this.prismaService.ingredient.findFirst({
		where: args,
		});
	}

	async create(dto: IngredientCreateDto): Promise<Ingredient> {
		return null
		/**
		return await this.prismaService.ingredient.create({
			data:{
				TO_DO
			}
		})
		*/
	}

	async update(dto: IngredientUpdateDto): Promise<Ingredient> {
		return null
		/**
		return await this.prismaService.ingredient.update({
			data:{
				TO_DO
			}
		})
		*/
	}

	async destroy(id: number) {
		return await this.prismaService.ingredient.delete({
			where: {
				id,
			},
		})
	}

	async findMany(args: IngredientListArgs): Promise<FindManyResult<Ingredient>> {
		const findManyArgs = await this.setFindManyArgs(args)
		const { where } = findManyArgs

		const items = await this.prismaService.ingredient.findMany(findManyArgs)
		const totalCount = await this.getCount(where)

		return {
			totalCount,
			items,
		}
	}

	async aggregate(args: IngredientListArgs) {
		const { where } = await this.setFindManyArgs(args)
		return await this.getAggregate(where)
	}

	async getAggregate(where: Prisma.IngredientWhereInput) {
		const fields: Prisma.IngredientCountAggregateInputType = {
			id: true,
		}
		return await this.prismaService.ingredient.aggregate({
			where,
			_count: { id: true },
			_sum: fields,
			_max: fields,
			_min: fields,
			_avg: fields,
		})
	}

	async getCount(where: Prisma.IngredientWhereInput) {
		return await this.prismaService.ingredient.count({ where })
	}

	async setFindManyArgs(
		args: IngredientListArgs,
	): Promise<Prisma.IngredientFindManyArgs> {
		const findManyArgs: Prisma.IngredientFindManyArgs = {
		}

		return this.prismaService.setOrderAndLimit(findManyArgs, args)
	}

}
