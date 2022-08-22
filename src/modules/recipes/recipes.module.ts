import { Module } from '@nestjs/common'
import { RecipesService } from '@src/modules/recipes/recipes.service'
import { RecipesResolver } from './recipes.resolver'

/**
 * ### Recipe 모듈
 *
 * Recipe 모듈입니다.
 *
 */
@Module({
	imports: [],
	providers: [RecipesService, RecipesResolver],
	exports: [RecipesService, RecipesResolver],
})
export class RecipesModule { }
