export function randomString(length: number = 10, radix: number = 36): string {
  let str = ""
  while(str.length < length) {
    str += Math.random().toString(radix).split('.')[1]
  }
  return str.slice(0, length)
}
