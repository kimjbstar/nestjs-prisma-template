import { Cocktail } from './cocktail'
import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

@ObjectType({
	description:
		'generated by [prisma-class-generator](https://github.com/kimjbstar/prisma-class-generator)',
})
export class Ingredient {
	@Field((type) => ID)
	id: number = undefined

	@Field((type) => String)
	name: string = undefined

	@Field((type) => [Cocktail])
	cocktails: Cocktail[] = undefined
}