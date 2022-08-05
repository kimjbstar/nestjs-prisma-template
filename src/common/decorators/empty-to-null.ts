import { Transform, TransformFnParams } from 'class-transformer'

export function EmptyToNull(): PropertyDecorator {
	return Transform((params: TransformFnParams): any => {
		if (params.value === '') {
			return null
		}
		return params.value
	})
}
