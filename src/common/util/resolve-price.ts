/**
 * 가격 파싱
 * @param src
 * @returns
 */
export default function resolvePrice(src: string): number {
	const price = src.replace(/[,|원]*/g, '')
	return parseInt(price)
}
