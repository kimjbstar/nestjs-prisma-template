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

interface PrismaNotFoundExceptionPayload extends BaseExceptionPayload {
	name: string
}

interface PrismaNotFoundExceptionJsonException extends BaseJsonException {
	payload?: PrismaNotFoundExceptionPayload
}

export class PrismaNotFoundError {
	message: string
	name: string
	constructor(e: Error) {
		this.message = e.message
		this.name = e.name
	}
}

@Catch(PrismaNotFoundError)
export class PrismaNotFoundErrorFilter implements ExceptionFilter {
	constructor(private readonly utilService: UtilService) {}

	catch(exception: PrismaNotFoundError, host: ArgumentsHost) {
		const jsonResponse: PrismaNotFoundExceptionJsonException = {
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: '데이터 record fetch에 실패했습니다.',
			payload: {
				type: ExceptionType.PRISMA_NOT_FOUND,
				message: exception.message,
				name: exception.name,
			},
		}
		jsonResponse.stacks = this.utilService.getPrettyStack(exception)

		const ctx = host.switchToHttp()
		ctx.getResponse<Response>()
			.status(jsonResponse.statusCode)
			.json(jsonResponse)
	}
}
