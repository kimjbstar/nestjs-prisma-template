import { Module } from '@nestjs/common'
import { AuthController } from '@src/modules/auth/auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UsersService } from '../users/users.service'
import { InsungService } from '../insung/insung.service'
import { NaverService } from '../naver/naver.service'
import { ShipperTokensService } from '../shipper-tokens/shipper-tokens.service'
import { KakaoTemplatesService } from '../kakao-templates/kakao-templates.service'
import { SubscribersModule } from '../subscribers/subscribers.module'
import { PopbillService } from '../popbill/popbill.service'
import { SlackService } from '../slack/slack.service'

/**
 * ### 인증 로직 담당 모듈
 *
 * 암호화, 세션 관리 등을 담당하는 모듈입니다.
 */
@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				return {
					secret: configService.get<string>('SESSION_SECRET'),
					signOptions: { expiresIn: '24h' },
				}
			},
			inject: [ConfigService],
		}),
		SubscribersModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		UsersService,
		InsungService,
		NaverService,
		ShipperTokensService,
		KakaoTemplatesService,
		NaverService,
		PopbillService,
		SlackService,
	],
	exports: [AuthService],
})
export class AuthModule {}
