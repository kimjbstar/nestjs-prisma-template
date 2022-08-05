/**
 * 주어진 시간만큼 대기합니다. 일반적인 sleep와 동일합니다.
 * @param ms 대기할 시간 (ms)
 * @returns
 */
export async function sleep(ms = 1000): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}
