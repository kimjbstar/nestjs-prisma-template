import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common'
import { LogipastaSessionData } from '@src/modules/auth/auth.service'
import { LogipastaRequest } from '../middlewares/context.middleware'
export const currentUser = createParamDecorator(
	(isStrict = true, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<LogipastaRequest>()
		const session: LogipastaSessionData = request.session
		if (!session.user && isStrict) {
			throw new UnauthorizedException(
				'서비스유저 로그인되어 있지 않습니다.',
			)
		}
		return session.user
	},
)

export const CurrentUser = currentUser
