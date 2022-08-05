import {
	BadRequestException,
	createParamDecorator,
	ExecutionContext,
} from '@nestjs/common'
import { LogipastaRequest } from '../middlewares/context.middleware'

export const currentCallcenter = createParamDecorator(
	(isStrict = true, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<LogipastaRequest>()
		const company = request.skin?.company ?? request.company
		if (!company && isStrict) {
			throw new BadRequestException('추론된 주선사가 없습니다.')
		}
		if (!company.callcenter && isStrict) {
			throw new BadRequestException('추론된 콜센터가 없습니다.')
		}
		return company?.callcenter ?? null
	},
)

export const CurrentCallcenter = currentCallcenter
//
