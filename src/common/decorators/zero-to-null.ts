import { Transform, TransformFnParams } from 'class-transformer'

export function ZeroToNull(): PropertyDecorator {
	return Transform((params: TransformFnParams): any => {
		if (params.value === 0) {
			return null
		}
		return params.value
	})
}
