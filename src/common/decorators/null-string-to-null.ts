import { Transform, TransformFnParams } from 'class-transformer'

export function NullStringToNull(): PropertyDecorator {
	return Transform((params: TransformFnParams): any => {
		if (params.value === 'null') {
			return null
		}
		return params.value
	})
}
