import { Book } from './book'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class Author {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: String })
	name: string

	@ApiProperty({ type: Date })
	createdAt: Date

	@ApiProperty({ type: Date })
	updatedAt: Date

	@ApiPropertyOptional({ type: Date })
	deletedAt?: Date

	@ApiProperty({ isArray: true, type: () => Book })
	Book: Book[]
}
