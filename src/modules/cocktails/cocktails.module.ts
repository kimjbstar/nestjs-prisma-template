import { Module } from '@nestjs/common'
import { CocktailsService } from '@src/modules/cocktails/cocktails.service'
import { CocktailsResolver } from './cocktails.resolver'

/**
 * ### Cocktail 모듈
 *
 * Cocktail 모듈입니다.
 *
 */
@Module({
	imports: [],
	providers: [CocktailsService, CocktailsResolver],
	exports: [CocktailsService, CocktailsResolver],
})
export class CocktailsModule { }
