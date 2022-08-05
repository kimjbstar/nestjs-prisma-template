import { Global, Module } from '@nestjs/common'
import { BaseLoggerModule } from '../base-logger/base-logger.module'
import { SlackService } from './slack.service'
import { SlackController } from '@src/controllers/slack.controller'

/**
 * ### 슬랙 모듈
 *
 * 슬랙 API를 통한 발송 등을 담당하는 모듈입니다.
 *
 */
@Global()
@Module({
	imports: [BaseLoggerModule],
	controllers: [SlackController],
	providers: [SlackService],
	exports: [SlackService],
})
export class SlackModule {}
