import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common'
import { map } from 'rxjs'
import { NormalResult } from '../common/dto/responses'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T> {
	constructor() {}
	intercept(context: ExecutionContext, next: CallHandler) {
		return next.handle().pipe(map((value) => new NormalResult(value)))
	}
}
