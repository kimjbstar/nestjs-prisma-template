import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'

export const ApiSingleFileUpload = (input: {
	isRequired?: boolean
	fieldName?: string
	maxCount?: number
	options?: MulterOptions
	description?: string
}) => {
	const { fieldName = 'file', maxCount = 1 } = input
	const decorators: Array<
		ClassDecorator | MethodDecorator | PropertyDecorator
	> = [
		ApiConsumes('multipart/form-data'),
		ApiBody({
			schema: {
				type: 'object',
				required: [fieldName],
				properties: {
					[fieldName]: {
						type: 'file',
						format: 'binary',
					},
				},
			},
		}),
		UseInterceptors(FileInterceptor(fieldName)),
	]

	return applyDecorators(...decorators)
}
