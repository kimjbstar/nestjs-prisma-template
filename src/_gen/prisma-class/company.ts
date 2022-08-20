import { Author } from './author'
import { CompanyType } from '@prisma/client'
import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { GraphQLJSONObject } from 'graphql-type-json'

@ObjectType()
export class Company {
	@ApiProperty({ type: Number })
	@Field((type) => ID)
	id: number = undefined

	@ApiProperty({ type: String })
	@Field((type) => String)
	name: string = undefined

	@ApiProperty({ enum: CompanyType, enumName: 'CompanyType' })
	@Field((type) => CompanyType)
	type: CompanyType = CompanyType.A

	@ApiProperty({ type: Date })
	@Field((type) => Date)
	createdAt: Date = undefined

	@ApiProperty({ type: Date })
	@Field((type) => Date)
	updatedAt: Date = undefined

	@ApiPropertyOptional({ type: Date })
	@Field((type) => Date, { nullable: true })
	deletedAt?: Date = undefined

	@ApiProperty({ isArray: true, type: () => Author })
	@Field((type) => [Author])
	authors: Author[] = undefined
}
registerEnumType(CompanyType, {
	name: 'CompanyType',
})
