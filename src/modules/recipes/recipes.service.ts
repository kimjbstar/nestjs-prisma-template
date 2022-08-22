import { Recipe, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { FindManyResult } from '@src/common/base.repository'
import { PrismaService } from '@src/modules/prisma/prisma.service'
import { RecipeListArgs } from './args/recipe-list.args'
import { RecipeCreateDto } from './dtos/recipe-create.dto'
import { RecipeUpdateDto } from './dtos/recipe-update.dto'

@Injectable()
export class RecipesService {
	constructor(
		private readonly prismaService: PrismaService
	) {}

	async findByPk(id: number): Promise<Recipe> {
		return await this.prismaService.recipe.findUnique({
		where: { id },
		});
	}

	async findFirst(args: Prisma.RecipeWhereInput): Promise<Recipe> {
		return await this.prismaService.recipe.findFirst({
		where: args,
		});
	}

	async create(dto: RecipeCreateDto): Promise<Recipe> {
		return null
		/**
		return await this.prismaService.recipe.create({
			data:{
				TO_DO
			}
		})
		*/
	}

	async update(dto: RecipeUpdateDto): Promise<Recipe> {
		return null
		/**
		return await this.prismaService.recipe.update({
			data:{
				TO_DO
			}
		})
		*/
	}

	async destroy(id: number) {
		return await this.prismaService.recipe.delete({
			where: {
				id,
			},
		})
	}

	async findMany(args: RecipeListArgs): Promise<FindManyResult<Recipe>> {
		const findManyArgs = await this.setFindManyArgs(args)
		const { where } = findManyArgs

		const items = await this.prismaService.recipe.findMany(findManyArgs)
		const totalCount = await this.getCount(where)

		return {
			totalCount,
			items,
		}
	}

	async aggregate(args: RecipeListArgs) {
		const { where } = await this.setFindManyArgs(args)
		return await this.getAggregate(where)
	}

	async getAggregate(where: Prisma.RecipeWhereInput) {
		const fields: Prisma.RecipeCountAggregateInputType = {
			id: true,
		}
		return await this.prismaService.recipe.aggregate({
			where,
			_count: { id: true },
			_sum: fields,
			_max: fields,
			_min: fields,
			_avg: fields,
		})
	}

	async getCount(where: Prisma.RecipeWhereInput) {
		return await this.prismaService.recipe.count({ where })
	}

	async setFindManyArgs(
		args: RecipeListArgs,
	): Promise<Prisma.RecipeFindManyArgs> {
		const findManyArgs: Prisma.RecipeFindManyArgs = {
		}

		return this.prismaService.setOrderAndLimit(findManyArgs, args)
	}

}
