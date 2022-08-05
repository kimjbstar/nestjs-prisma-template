import { snakeCase } from 'change-case'

/**
 * object의 key를 순회하며 snake_case로 변환합니다.
 * @param obj snake 처리할 object
 * @returns
 */
export default function snakeObjectKeys(obj: any): any {
	return Object.entries(obj).reduce((result, [key, value]) => {
		result[snakeCase(key)] = value
		return result
	}, {} as any)
}
