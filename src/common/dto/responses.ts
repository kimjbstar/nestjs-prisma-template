import { ApiProperty } from '@nestjs/swagger'

export type ClassConstructorType = new (...args: any[]) => any

export class NormalResult<T = object> {
	@ApiProperty({
		description: 'statusCode',
		example: 200,
		type: Number,
	})
	statusCode: number

	@ApiProperty({
		description: 'message',
		example: 'OK',
		type: String,
	})
	message: string

	constructor(obj?: T) {
		this.statusCode = 200
		this.message = 'OK'

		Object.assign(this, obj)
	}
}

export class PaginatedResult<TData> {
	constructor(obj?: object) {
		Object.assign(this, obj)
	}

	@ApiProperty({
		type: Number,
		description:
			'페이징을 적용하지 않은 총 갯수입니다. 페이지네이션 등에 사용힙니다.',
	})
	totalCount?: number

	@ApiProperty({
		type: Boolean,
		description: '다음 데이터가 있는지 여부입니다.',
	})
	hasNext?: boolean

	results: TData[]
}

export class AssignableClass {
	constructor(obj?: object) {
		Object.assign(this, obj)
	}
}
