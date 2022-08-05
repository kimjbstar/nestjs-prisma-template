import { Order } from '@prisma/client'

export class FirebaseServiceMock {
	init() {}
	async get(key: string) {}
	async set(key: string, value: any) {}
	async delete(key: string) {}
	async setNewOrder(
		order: Order,
		locations: {
			fromX: number
			fromY: number
			toX: number
			toY: number
		},
	) {}
	async setRiderInfo(
		order,
		info: {
			createdAt: string
			lat: string
			lon: string
		},
	) {}
	async setStatus(order) {}
}
