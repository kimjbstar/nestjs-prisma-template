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
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

const prismaCodeToMessage = {
	P2000: "The provided value for the column is too long for the column's type. Column: {column_name}",
	P2001: 'The record searched for in the where condition ({model_name}.{argument_name} = {argument_value}) does not exist',
	P2002: 'Unique constraint failed on the {constraint}',
	P2003: 'Foreign key constraint failed on the field: {field_name}',
	P2004: 'A constraint failed on the database: {database_error}',
	P2005: "The value {field_value} stored in the database for the field {field_name} is invalid for the field's type",
	P2006: 'The provided value {field_value} for {model_name} field {field_name} is not valid',
	P2007: 'Data validation error {database_error}',
	P2008: 'Failed to parse the query {query_parsing_error} at {query_position}',
	P2009: 'Failed to validate the query: {query_validation_error} at {query_position}',
	P2010: 'Raw query failed. Code: {code}. Message: {message}',
	P2011: 'Null constraint violation on the {constraint}',
	P2012: 'Missing a required value at {path}',
	P2013: 'Missing the required argument {argument_name} for field {field_name} on {object_name}.',
	P2014: "The change you are trying to make would violate the required relation '{relation_name}' between the {model_a_name} and {model_b_name} models.",
	P2015: 'A related record could not be found. {details}',
	P2016: 'Query interpretation error. {details}',
	P2017: 'The records for relation {relation_name} between the {parent_name} and {child_name} models are not connected.',
	P2018: 'The required connected records were not found. {details}',
	P2019: 'Input error. {details}',
	P2020: 'Value out of range for the type. {details}',
	P2021: 'The table {table} does not exist in the current database.',
	P2022: 'The column {column} does not exist in the current database.',
	P2023: 'Inconsistent column data: {message}',
	P2024: 'Timed out fetching a new connection from the connection pool. (More info: http://pris.ly/d/connection-pool, Current connection limit: {connection_limit})',
	P2025: 'update 대상 레코드 없음',
	P2026: "The current database provider doesn't support a feature that the query used: {feature}",
	P2027: 'Multiple errors occurred on the database during query execution: {errors}',
	P2030: 'Cannot find a fulltext index to use for the search, try adding a @@fulltext([Fields...]) to your schema',
	P9999: '[테스트] FK 연결 실패',
}

interface PrismaClientKnownRequestExceptionPayload
	extends BaseExceptionPayload {
	name: string
}

interface PrismaClientKnownRequestExceptionJsonException
	extends BaseJsonException {
	payload?: PrismaClientKnownRequestExceptionPayload
}

@Catch(PrismaClientKnownRequestError)
export class PrismaClientKnownRequestErrorFilter implements ExceptionFilter {
	constructor(private readonly utilService: UtilService) {}

	catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
		exception.message = prismaCodeToMessage[exception.code]

		const jsonResponse: PrismaClientKnownRequestExceptionJsonException = {
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: '서버에서 에러가 발생했습니다.',
			payload: {
				type: ExceptionType.PRISMA_CLIENT_KNOWN,
				name: exception.name,
				message: null,
			},
		}
		jsonResponse.stacks = this.utilService.getPrettyStack(exception)
		jsonResponse.stacks.unshift(exception.message)

		const ctx = host.switchToHttp()
		ctx.getResponse<Response>()
			.status(jsonResponse.statusCode)
			.json(jsonResponse)
	}
}
