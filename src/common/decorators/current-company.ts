import {
	BadRequestException,
	createParamDecorator,
	ExecutionContext,
} from '@nestjs/common'
import { LogipastaRequest } from '../middlewares/context.middleware'

export const currentCompany = createParamDecorator(
	(isStrict = true, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<LogipastaRequest>()
		const company = request.skin?.company ?? request.company
		if (!company && isStrict) {
			throw new BadRequestException('추론된 주선사가 없습니다.')
		}
		return company
	},
)

export const CurrentCompany = currentCompany
