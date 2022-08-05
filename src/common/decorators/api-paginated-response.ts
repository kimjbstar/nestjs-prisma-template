import { applyDecorators, Type } from '@nestjs/common'
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger'
import { PaginatedResult } from '../dto/responses'

export const ApiPaginatedResponse = <TModel extends Type<any>>(
	model: TModel,
) => {
	return applyDecorators(
		ApiOkResponse({
			schema: {
				allOf: [
					{ $ref: getSchemaPath(PaginatedResult) },
					{
						properties: {
							results: {
								type: 'array',
								items: { $ref: getSchemaPath(model) },
							},
						},
					},
				],
			},
		}),
	)
}
