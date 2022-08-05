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
import { PrismaClientValidationError } from '@prisma/client/runtime'

interface PrismaClientValidationExceptionPayload extends BaseExceptionPayload {
	name: string
}

interface PrismaClientValidationExceptionJsonException
	extends BaseJsonException {
	payload?: PrismaClientValidationExceptionPayload
}

@Catch(PrismaClientValidationError)
export class PrismaClientValidationErrorFilter implements ExceptionFilter {
	constructor(private readonly utilService: UtilService) {}

	catch(exception: PrismaClientValidationError, host: ArgumentsHost) {
		console.log('exception', exception)

		const jsonResponse: PrismaClientValidationExceptionJsonException = {
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: '서버에서 에러가 발생했습니다.',
			payload: {
				type: ExceptionType.PRISMA_CLIENT_VALIDATION,
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
