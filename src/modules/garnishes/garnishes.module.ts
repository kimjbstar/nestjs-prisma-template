import { Module } from '@nestjs/common'
import { GarnishesService } from '@src/modules/garnishes/garnishes.service'
import { GarnishesResolver } from './garnishes.resolver'

/**
 * ### Garnish 모듈
 *
 * Garnish 모듈입니다.
 *
 */
@Module({
	imports: [],
	providers: [GarnishesService, GarnishesResolver],
	exports: [GarnishesService, GarnishesResolver],
})
export class GarnishesModule { }
