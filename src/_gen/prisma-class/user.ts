import { UserRole } from '@prisma/client'
import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { GraphQLJSONObject } from 'graphql-type-json'

@ObjectType()
export class User {
	@ApiProperty({ type: Number })
	@Field((type) => ID)
	id: number = undefined

	@ApiProperty({ type: String })
	@Field((type) => String)
	email: string = undefined

	@ApiProperty({ type: String })
	@Field((type) => String)
	name: string = undefined

	@ApiProperty({ type: String })
	@Field((type) => String)
	password: string = undefined

	@ApiProperty({ type: String })
	@Field((type) => String)
	salt: string = undefined

	@ApiProperty({ enum: UserRole, enumName: 'UserRole' })
	@Field((type) => UserRole)
	role: UserRole = undefined

	@ApiPropertyOptional({ type: String })
	@Field((type) => String, { nullable: true })
	addressRoad?: string = undefined

	@ApiPropertyOptional({ type: String })
	@Field((type) => String, { nullable: true })
	addressDetail?: string = undefined

	@ApiPropertyOptional({ type: Number })
	@Field((type) => Int, { nullable: true })
	age?: number = undefined

	@ApiPropertyOptional({ type: Date })
	@Field((type) => Date, { nullable: true })
	lastLoginedAt?: Date = undefined

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
}
registerEnumType(UserRole, {
	name: 'UserRole',
})
