import { BadRequestException, Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiNormalResponse } from '@src/common/decorators/api-normal-response'
import { NormalResult } from '@src/common/dto/responses'
import CUSTOM_CODE_MAP from '@src/common/exceptions/custom-code-map'
import { CustomException } from '@src/common/exceptions/filters/custom.exception-filters'
import { InsungException } from '@src/common/exceptions/filters/insung.exception-filters'
import { InsungWrapperException } from '@src/common/exceptions/filters/insung-wrapper.exception-filters'
import { TokenExpiredException } from '../common/exceptions/http-exceptions'
import moment from 'moment'
import { TscientificException } from '../common/exceptions/filters/tscientific.exception-filters'
import { NaverException } from '../common/exceptions/filters/naver.exception-filters'
import { PrismaNotFoundError } from '../common/exceptions/filters/prisma-not-found.exception-filters'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { PrismaService } from '../modules/prisma/prisma.service'

@Controller('exception')
@ApiTags('exception')
export class ExceptionController {
	constructor(private readonly prismaService: PrismaService) {}

	@Get('insung')
	@ApiNormalResponse({
		description: '의도적으로 InsungException을 발생시켜 리턴합니다.',
	})
	async insung(): Promise<void> {
		throw new InsungException({
			url: '/member_regist',
			params: {
				foo: 'bar1',
			},
			result: {
				code: '1001',
				msg: 'RESULT:OAUTH-FAILED',
			},
			message: 'ex) 인성에서 해당 아이디를 중복되었다고 인식합니다...',
		})
	}

	@Get('insung_wrapper')
	@ApiNormalResponse({
		description: '의도적으로 InsungException을 발생시켜 리턴합니다.',
	})
	async insungWrapper(): Promise<void> {
		throw new InsungWrapperException({
			url: '/member_detail',
			params: {
				foo: 'bar',
			},
			curl: 'curl -X POST -d foo=bar https://api.insung.logipasta.com/v0/member_detail',
			result: {
				date: moment().format('YYYY-MM-DD hh:mm:ss'),
				response: {
					status: 504,
					statusText: 'Gateway Timeout',
					data: null,
				},
			},
			message: `UNKNOWN ERROR IN FETCH - 502, insung-wrapper-api 담당자한테 슬랙 알림이 전송됬습니다.(예제)`,
		})
	}

	@Get('tscientific')
	@ApiNormalResponse({
		description: '의도적으로 InsungException을 발생시켜 리턴합니다.',
	})
	async tscientific(): Promise<void> {
		throw new TscientificException({
			message: '테스트 메시지',
			path: 'couponCreate.do',
			parameter: {
				foo: 'bar',
			},
		})
	}

	@Get('custom')
	@ApiNormalResponse({
		description: '의도적으로 CustomException을 발생시켜 리턴합니다.',
	})
	async custom(): Promise<NormalResult> {
		throw new CustomException({
			code: 'PASSWORD_REQUIRED_TO_UPDATE_INSUNG_USER',
		})
	}

	@Get('bad_request')
	@ApiNormalResponse({
		description: '의도적으로 BadRequestException 발생시켜 리턴합니다.',
	})
	async badRequest(): Promise<NormalResult> {
		throw new BadRequestException('name이 없습니다.')
	}

	@Get('custom_map')
	async getCustomCodeMap(): Promise<NormalResult> {
		return new NormalResult({
			result: CUSTOM_CODE_MAP,
		})
	}

	@Get('token_expired_at')
	async tokenExpiredAt(): Promise<any> {
		throw new TokenExpiredException(moment().unix())
	}

	@Get('naver')
	async naver(): Promise<any> {
		throw new NaverException({
			message: '바다로 갈 수 없습니다.',
			path: 'v1/driving',
			params: {
				foo: 'bar',
				destination: '동해바다',
			},
			url: 'api.naver.com/v1/driving?...',
		})
	}

	@Get('prisma_not_found')
	async prismaNotFound() {
		throw new PrismaNotFoundError({
			message: 'a',
			name: 'b',
		})
	}

	@Get('prisma')
	async prisma() {
		throw new PrismaClientKnownRequestError(
			'fk 연결 에러',
			'P9999',
			'1.x.x',
		)
	}

	@Get('just')
	async just() {
		throw new Error('default error')
	}

	@Get('p')
	async p() {
		await this.prismaService.user.findUnique({
			where: {
				id: 'a' as any,
			},
		})
	}
}
