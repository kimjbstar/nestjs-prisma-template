import {
	CallHandler,
	ExecutionContext,
	HttpException,
	Injectable,
	NestInterceptor,
} from '@nestjs/common'
import { PrismaClientValidationError } from '@prisma/client/runtime'
import { catchError, throwError } from 'rxjs'
import { UtilService } from '../modules/util/util.service'

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
	constructor(private readonly utilService: UtilService) {}
	intercept(context: ExecutionContext, next: CallHandler) {
		return next.handle().pipe(
			catchError((error: Error) => {
				if (error instanceof HttpException === false) {
					this.utilService.notifyUnhandledError(error)
				}
				return throwError(() => error)
			}),
		)
	}
}
