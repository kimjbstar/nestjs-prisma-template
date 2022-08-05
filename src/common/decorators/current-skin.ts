import {
	BadRequestException,
	createParamDecorator,
	ExecutionContext,
} from '@nestjs/common'
import { LogipastaRequest } from '../middlewares/context.middleware'

export const currentSkin = createParamDecorator(
	(isStrict = true, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<LogipastaRequest>()
		if (!request.skin && isStrict) {
			throw new BadRequestException('추론된 스킨이 없습니다.')
		}
		return request.skin
	},
)

export const CurrentSkin = currentSkin
