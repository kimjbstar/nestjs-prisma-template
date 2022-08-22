import { User as _User } from './user'
import { Cocktail as _Cocktail } from './cocktail'
import { Glass as _Glass } from './glass'
import { Technique as _Technique } from './technique'
import { Garnish as _Garnish } from './garnish'
import { Ingredient as _Ingredient } from './ingredient'
import { Recipe as _Recipe } from './recipe'

export namespace PrismaModel {
	export class User extends _User {}
	export class Cocktail extends _Cocktail {}
	export class Glass extends _Glass {}
	export class Technique extends _Technique {}
	export class Garnish extends _Garnish {}
	export class Ingredient extends _Ingredient {}
	export class Recipe extends _Recipe {}

	export const extraModels = [
		User,
		Cocktail,
		Glass,
		Technique,
		Garnish,
		Ingredient,
		Recipe,
	]
}
