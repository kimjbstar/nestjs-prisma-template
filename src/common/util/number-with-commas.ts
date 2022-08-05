/**
 * 콤마(,) 포맷 처리합니다.
 * @param x number
 * @returns
 */
export default function numberWithCommas(x: number | string): string {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
