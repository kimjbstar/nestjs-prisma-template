import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

/**
 * API 문서에 지원 종료 여부를 표시합니다. 대안(alternative) 엔드포인트 정보가 필요합니다.
 * @param alternative 대안 엔드포인트
 * @returns
 */
export const GuideDeprecated = (input: { alternative: string }) => {
	const { alternative } = input
	return applyDecorators(
		ApiTags('#deprecated 예정'),
		ApiOperation({
			deprecated: true,
			summary: `해당 API 대신 /api/${alternative}를 이용 바랍니다.`,
		}),
	)
}
