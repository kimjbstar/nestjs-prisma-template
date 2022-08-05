export interface BaseJsonException {
	statusCode: number
	message: string
	stacks?: string[]
	payload?: Record<string, any>
}
