/**
 * specific property to optional
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> &
	Partial<Pick<T, K>>

/**
 * example :
 * function assertInt<T extends number>(n: AssertInt<T>) {}
 * assertInt(3)
 * assertInt(3.1)
 * assertInt(1e-99)
 */
export type AssertInt<T extends number> = `${T}` extends `${infer U}.${infer R}`
	? never
	: `${T}` extends `${infer U}e${infer R}`
	? never
	: T

// https://stackoverflow.com/questions/41285211/overriding-interface-property-type-defined-in-typescript-d-ts-file
export type Modify<T, R> = Omit<T, keyof R> & R

export type Arrayable<T> = T | T[]

export type ValueOf<T> = T[keyof T]
