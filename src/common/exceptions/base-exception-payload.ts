import ExceptionType from './exception-types'

export interface BaseExceptionPayload {
	message: string
	type: ExceptionType
}
