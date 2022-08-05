/**
 * object를 deep copy 처리합니다.
 * @param src : 복사할 object;
 * @returns
 */
export default function clone<T>(src: T): T {
	return JSON.parse(JSON.stringify(src))
}
