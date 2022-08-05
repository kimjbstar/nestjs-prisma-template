export class Defer {
  /** 미뤄진 함수 배열 */
  deferreds: Function[] = []
  push(deferred: Function) {
    this.deferreds.push(deferred)
    return this
  }
  /** 미뤄진 함수들을 역순으로 실행 */
  async resolve() {
    for (var idx = this.deferreds.length - 1; idx >= 0; idx--) {
      const deferred = this.deferreds[idx]
      await deferred()
    }
  }
}

export async function DeferContext<T = any>(func: (push: Function) => Promise<T> | T) {
  const defer = new Defer

  const result = await func(defer.push.bind(defer))

  await defer.resolve()

  return result
}
