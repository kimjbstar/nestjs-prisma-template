import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { LogipastaRequest } from '../middlewares/context.middleware'
export const currentPlatform = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<LogipastaRequest>()
		return request.platform
	},
)

export const CurrentPlatform = currentPlatform
