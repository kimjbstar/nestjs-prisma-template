import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common'
import { LogipastaSessionData } from '@src/modules/auth/auth.service'
import { LogipastaRequest } from '../middlewares/context.middleware'
export const currentAdministrator = createParamDecorator(
	(isStrict = true, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<LogipastaRequest>()
		const session: LogipastaSessionData = request.session
		if (!session.administrator && isStrict) {
			throw new UnauthorizedException('어드민 로그인되어 있지 않습니다.')
		}
		return session.administrator
	},
)

export const CurrentAdministrator = currentAdministrator
