import { Prisma } from '@prisma/client'
import { camelCase } from 'change-case'
import { BaseListArgs } from './dto/base-list-args'
import { PaginatedResult } from './dto/responses'
import { PrismaNotFoundError } from './exceptions/filters/prisma-not-found.exception-filters'

export interface FindManyArgs {
	select?: any
	include?: any
	where?: any
	orderBy?: any
	cursor?: any
	take?: number
	skip?: number
}

export interface FindManyResult<T> {
	totalCount: number
	totalSum?: number
	list: T[]
}

export function ListResponse<T>(
	findManyResult: FindManyResult<T>,
	collectionName: string,
) {
	const { totalCount, list, totalSum } = findManyResult
	return new PaginatedResult<T>({
		totalCount,
		totalSum,
		[collectionName]: list,
	})
}

export class BaseRepository {}
