import { Transform, TransformFnParams } from 'class-transformer'

export function ToBoolean(): PropertyDecorator {
	return Transform(
		(params: TransformFnParams): boolean =>
			params.value === 'true' ||
			params.value === true ||
			params.value === 1 ||
			params.value === '1',
	)
}
