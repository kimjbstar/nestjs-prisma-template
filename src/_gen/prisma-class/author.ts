import { Company } from './company'
import { Post } from './post'
import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { GraphQLJSONObject } from 'graphql-type-json'

@ObjectType()
export class Author {
	@ApiProperty({ type: String })
	@Field((type) => ID)
	id: string = undefined

	@ApiProperty({ type: () => Company })
	@Field((type) => Company)
	company: Company = undefined

	@ApiProperty({ type: String })
	@Field((type) => String)
	name: string = undefined

	@ApiPropertyOptional()
	@Field((type) => GraphQLJSONObject, { nullable: true })
	extra?: any = undefined

	@ApiProperty({ type: Date })
	@Field((type) => Date)
	createdAt: Date = undefined

	@ApiProperty({ type: Date })
	@Field((type) => Date)
	updatedAt: Date = undefined

	@ApiPropertyOptional({ type: Date })
	@Field((type) => Date, { nullable: true })
	deletedAt?: Date = undefined

	@ApiProperty({ isArray: true, type: () => Post })
	@Field((type) => [Post])
	posts: Post[] = undefined

	@ApiProperty({ type: String })
	@Field((type) => String)
	companyId: string = undefined
}
