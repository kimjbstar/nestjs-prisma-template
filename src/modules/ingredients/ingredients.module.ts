import { Module } from '@nestjs/common'
import { IngredientsService } from '@src/modules/ingredients/ingredients.service'
import { IngredientsResolver } from './ingredients.resolver'

/**
 * ### Ingredient 모듈
 *
 * Ingredient 모듈입니다.
 *
 */
@Module({
	imports: [],
	providers: [IngredientsService, IngredientsResolver],
	exports: [IngredientsService, IngredientsResolver],
})
export class IngredientsModule { }
