import { Author, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { FindManyResult } from '@src/common/base.repository'
import { PrismaService } from '@src/modules/prisma/prisma.service'
import { AuthorListArgs } from './args/author-list.args'
import { AuthorCreateDto } from './dtos/author-create.dto'
import { AuthorUpdateDto } from './dtos/author-update.dto'

@Injectable()
export class AuthorsService {
	constructor(
		private readonly prismaService: PrismaService
	) {}

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

	async create(dto: AuthorCreateDto): Promise<Author> {
		return null
		/**
		return await this.prismaService.author.create({
			data:{
				TO_DO
			}
		})
		*/
	}

	async update(dto: AuthorUpdateDto): Promise<Author> {
		return null
		/**
		return await this.prismaService.author.update({
			data:{
				TO_DO
			}
		})
		*/
	}

	async destroy(id: number) {
		return await this.prismaService.author.delete({
			where: {
				id,
			},
		})
	}

	async findMany(args: AuthorListArgs): Promise<FindManyResult<Author>> {
		const findManyArgs = await this.setFindManyArgs(args)
		const { where } = findManyArgs

		const items = await this.prismaService.author.findMany(findManyArgs)
		const totalCount = await this.getCount(where)

		return {
			totalCount,
			items,
		}
	}

	async aggregate(args: AuthorListArgs) {
		const { where } = await this.setFindManyArgs(args)
		return await this.getAggregate(where)
	}

	async getAggregate(where: Prisma.AuthorWhereInput) {
		const fields: Prisma.AuthorCountAggregateInputType = {
			id: true,
		}
		return await this.prismaService.author.aggregate({
			where,
			_count: { id: true },
			_sum: fields,
			_max: fields,
			_min: fields,
			_avg: fields,
		})
	}

	async getCount(where: Prisma.AuthorWhereInput) {
		return await this.prismaService.author.count({ where })
	}

	async setFindManyArgs(
		args: AuthorListArgs,
	): Promise<Prisma.AuthorFindManyArgs> {
		const findManyArgs: Prisma.AuthorFindManyArgs = {
		}

		return this.prismaService.setOrderAndLimit(findManyArgs, args)
	}

}
