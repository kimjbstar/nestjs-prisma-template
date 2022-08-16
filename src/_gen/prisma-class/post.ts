import { Author } from './author'
import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { GraphQLJSONObject } from 'graphql-type-json'

@ObjectType()
export class Post {
	@ApiProperty({ type: String })
	@Field((type) => ID)
	id: string = undefined

	@ApiProperty({ type: String })
	@Field((type) => String)
	name: string = undefined

	@ApiProperty({ type: () => Author })
	@Field((type) => Author)
	author: Author = undefined

	@ApiProperty({ type: Date })
	@Field((type) => Date)
	createdAt: Date = undefined

	@ApiProperty({ type: Date })
	@Field((type) => Date)
	updatedAt: Date = undefined

	@ApiPropertyOptional({ type: Date })
	@Field((type) => Date, { nullable: true })
	deletedAt?: Date = undefined

	@ApiProperty({ type: String })
	@Field((type) => String)
	authorId: string = undefined
}
