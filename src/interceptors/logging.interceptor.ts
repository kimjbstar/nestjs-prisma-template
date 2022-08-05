import {
	CallHandler,
	ExecutionContext,
	HttpException,
	Injectable,
	NestInterceptor,
} from '@nestjs/common'
import { LogipastaRequest } from '@src/common/middlewares/context.middleware'
import { BaseLoggerService } from '@src/modules/base-logger/base-logger.service'
import { UtilService } from '@src/modules/util/util.service'
import { catchError, throwError } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(
		private readonly baseLoggerService: BaseLoggerService,
		private readonly utilService: UtilService,
	) {}

	intercept(context: ExecutionContext, next: CallHandler) {
		const req = context.switchToHttp().getRequest<LogipastaRequest>()

		const { ip, query, body, headers, hostname } = req

		this.baseLoggerService.log(
			JSON.stringify({ headers, hostname, ip, query, body }),
			'logs/access',
		)
		return next.handle().pipe(
			catchError((err: Error) => {
				if (!(err instanceof HttpException)) {
					const stacks = this.utilService.getPrettyStack(err)
					this.baseLoggerService.error(JSON.stringify(stacks))
				}
				return throwError(() => err)
			}),
		)
	}
}
