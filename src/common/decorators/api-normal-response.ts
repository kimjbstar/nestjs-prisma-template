import { applyDecorators } from '@nestjs/common'
import {
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiServiceUnavailableResponse,
	getSchemaPath,
} from '@nestjs/swagger'
import {
	ReferenceObject,
	SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { ClassConstructorType, NormalResult } from '../dto/responses'

export const ApiNormalResponse = (input?: {
	models?: {
		[key: string]: ClassConstructorType | ClassConstructorType[] | string
	}
	description?: string
}) => {
	const { models, description: msg } = input || {}
	let properties: Record<string, SchemaObject | ReferenceObject> = {}
	if (models) {
		properties = Object.entries(models).reduce((result, [key, model]) => {
			if (Array.isArray(model)) {
				result[key] = {
					type: 'array',
					items: {
						$ref: getSchemaPath(model[0]),
					},
				}
			} else if (model instanceof Function) {
				result[key] = {
					$ref: getSchemaPath(model),
				}
			} else {
				result[key] = {
					type: model,
				}
			}

			return result
		}, {})
	}

	const decorators: Array<
		ClassDecorator | MethodDecorator | PropertyDecorator
	> = [
		ApiOkResponse({
			description: 'OK : 정상 리턴입니다.',
			schema: {
				allOf: [
					{ $ref: getSchemaPath(NormalResult) },
					{
						properties: properties,
					},
				],
				title: 'NormalResult',
				description: '로지파스타 공통 Response Shape입니다.',
			},
		}),
		ApiNotFoundResponse({
			description: 'Not Found : 잘못된 URL 입력 시 발생할 수 있습니다.',
		}),
		ApiInternalServerErrorResponse({
			description:
				'Internal Server Error : 내부 서버 에러입니다. 개발자한테 문의해주세요.',
		}),
		ApiServiceUnavailableResponse({
			description:
				'Service Unavailable : 서버가 요청을 처리할 준비가 되지 않았음을 나타내는 코드입니다. 로지파스타에서는 주로 인성데이타 측 에러로 발생합니다.',
		}),
		ApiResponse({
			status: 520,
			description: 'Custom Error : 비즈니스 로직 에러입니다.',
		}),
	]

	if (msg) {
		decorators.push(
			ApiOperation({
				summary: msg,
				description: msg,
			}),
		)
	}

	return applyDecorators(...decorators)
}
