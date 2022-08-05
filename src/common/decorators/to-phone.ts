import { Transform, TransformFnParams } from 'class-transformer'

export function ToPhone(): PropertyDecorator {
	return Transform((params: TransformFnParams) => {
		return params.value.replace(/-/g, '')
	})
}
