import { Module } from '@nestjs/common'
import { GlassesService } from '@src/modules/glasses/glasses.service'
import { GlassesResolver } from './glasses.resolver'

/**
 * ### Glass 모듈
 *
 * Glass 모듈입니다.
 *
 */
@Module({
	imports: [],
	providers: [GlassesService, GlassesResolver],
	exports: [GlassesService, GlassesResolver],
})
export class GlassesModule { }
