import { Global, Module } from '@nestjs/common'

import { BaseLoggerService } from './base-logger.service'

/**
 * ### 로거 모듈
 *
 * 로그를 관리하는 모듈입니다.
 */
@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [BaseLoggerService],
	exports: [BaseLoggerService],
})
export class BaseLoggerModule {}
