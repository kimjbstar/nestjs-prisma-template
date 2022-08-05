import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from '@nestjs/common'
import { UtilService } from '@src/modules/util/util.service'
import { Response } from 'express'
import { BaseExceptionPayload } from '../base-exception-payload'
import { BaseJsonException } from '../base-json-exception'
import ExceptionType from '../exception-types'

interface DefaultExceptionPayload extends BaseExceptionPayload {
	name: string
	stack?: any
}

interface DefaultExceptionJsonException extends BaseJsonException {
	payload?: DefaultExceptionPayload
}

export class DefaultException {
	message: string
	name: string
	stack: any
	constructor(e: Error) {
		this.message = e.message
		this.name = e.name
		this.stack = e.stack
	}
}

@Catch(DefaultException)
export class DefaultExceptionsFilter implements ExceptionFilter {
	constructor(private readonly utilService: UtilService) {}

	catch(exception: DefaultException, host: ArgumentsHost) {
		const jsonResponse: DefaultExceptionJsonException = {
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: '기타 Error. 관리자에게 문의하세요.',
			payload: {
				type: ExceptionType.DEFAULT,
				name: exception.name,
				message: null,
			},
		}
		jsonResponse.stacks = this.utilService.getPrettyStack(exception)

		const ctx = host.switchToHttp()
		ctx.getResponse<Response>()
			.status(jsonResponse.statusCode)
			.json(jsonResponse)
	}
}
