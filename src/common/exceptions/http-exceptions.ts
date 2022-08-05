import { HttpException, HttpStatus } from '@nestjs/common'

/**
 * 범용적으로 쓰이고, 더 많은 정보가 필요할 가능성 있음
 * 추후 exception-filter 고려
 */
export class TokenExpiredException extends HttpException {
	constructor(expiredAt: number) {
		super(
			{
				statusCode: HttpStatus.UNAUTHORIZED,
				message: '토큰이 만료되었습니다.',
				expiredAt: expiredAt,
			},
			HttpStatus.UNAUTHORIZED,
		)
	}
}

/**
 * 테스트 코드에서만 사용할것
 */
export class YourCodeMustNotReachHereException extends HttpException {
	constructor() {
		super(
			{
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: '코드가 이곳에 도달하면 안됩니다.',
			},
			HttpStatus.INTERNAL_SERVER_ERROR,
		)
	}
}
