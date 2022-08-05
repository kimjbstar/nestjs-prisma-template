import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common'
import { snakeCase } from 'change-case'

function camelToSnake(src: string): string {
	return snakeCase(src)
}

function convertDeepIfObject(obj: unknown, converter: (s: string) => string) {
	if (obj === null) {
		return null
	}
	return typeof obj === 'object' ? keyConvert(obj, converter) : obj
}

function keyConvert(obj: Object, converter: (s: string) => string) {
	const keys = Object.keys(obj)
	for (let key of keys) {
		if (Array.isArray(obj[key]) === true) {
			obj[key] = obj[key].map((v) => convertDeepIfObject(v, converter))
		} else {
			obj[key] = convertDeepIfObject(obj[key], converter)
		}
		const newKey = converter(key)
		if (key !== newKey) {
			obj[newKey] = obj[key]
			delete obj[key]
		}
	}
	return obj
}

@Injectable()
export class ParseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler) {
		const req = context?.getArgs?.()?.[0]

		keyConvert(req.query, camelToSnake)
		keyConvert(req.body, camelToSnake)

		return next.handle()
	}
}
