import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from '@nestjs/common'
import { UtilService } from '@src/modules/util/util.service'
import { Response } from 'express'
import { BaseExceptionPayload } from '../base-exception-payload'
import { BaseJsonException } from '../base-json-exception'
import CUSTOM_CODE_MAP from '../custom-code-map'
import { ExceptionType } from '../exception-types'

interface CustomExceptionPayload extends BaseExceptionPayload {
	code: keyof typeof CUSTOM_CODE_MAP
	exampleMessage?: string
	reason?: string
}

interface CustomExceptionJsonException extends BaseJsonException {
	payload: CustomExceptionPayload
}

export class CustomException extends HttpException {
	customPayload: CustomExceptionPayload
	constructor(payload: Omit<CustomExceptionPayload, 'type' | 'message'>) {
		const { code, exampleMessage } = payload
		const message = exampleMessage ?? CUSTOM_CODE_MAP[code].exampleMessage
		const reason = CUSTOM_CODE_MAP[code].reason
		super(
			{
				statusCode: 520,
				message,
			},
			520,
		)
		this.customPayload = {
			type: ExceptionType.CUSTOM,
			code,
			message,
			reason,
		}
	}
}

@Catch(CustomException)
export class CustomExceptionsFilter implements ExceptionFilter {
	constructor(private readonly utilService: UtilService) {}

	catch(exception: CustomException, host: ArgumentsHost) {
		const jsonResponse: CustomExceptionJsonException = {
			statusCode: exception.getStatus(),
			message: exception.customPayload.message,
			payload: exception.customPayload,
		}
		jsonResponse.stacks = this.utilService.getPrettyStack(exception)

		if (this.utilService.isProduction() === true) {
			jsonResponse.payload.reason = null
		}

		const ctx = host.switchToHttp()
		ctx.getResponse<Response>()
			.status(jsonResponse.statusCode)
			.json(jsonResponse)
	}
}
