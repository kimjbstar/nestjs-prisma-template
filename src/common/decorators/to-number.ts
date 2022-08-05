import { Transform, TransformFnParams } from 'class-transformer'

export function ToNumber(): PropertyDecorator {
	return Transform((params: TransformFnParams): Number => {
		if (params.value === '') {
			return null
		}
		return Number(params.value)
	})
}
