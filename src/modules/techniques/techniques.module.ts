import { Module } from '@nestjs/common'
import { TechniquesService } from '@src/modules/techniques/techniques.service'
import { TechniquesResolver } from './techniques.resolver'

/**
 * ### Technique 모듈
 *
 * Technique 모듈입니다.
 *
 */
@Module({
	imports: [],
	providers: [TechniquesService, TechniquesResolver],
	exports: [TechniquesService, TechniquesResolver],
})
export class TechniquesModule { }
