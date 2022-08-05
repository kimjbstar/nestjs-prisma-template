import { camelCase } from 'change-case'

/**
 * object의 key를 순회하며 camelCase로 변환합니다.
 * @param obj camel 처리할 object
 * @returns
 */
export default function camelizeObjectKeys(obj): any {
	if (!obj) {
		return {}
	}
	return Object.entries(obj).reduce((result, [key, value]) => {
		const newKey = camelCase(key).replace('_', '')
		result[newKey] = value
		return result
	}, {})
}
