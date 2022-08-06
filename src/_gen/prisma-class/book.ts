import { Author } from './author'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class Book {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: String })
	name: string

	@ApiProperty({ type: () => Author })
	author: Author

	@ApiProperty({ type: Date })
	createdAt: Date

	@ApiProperty({ type: Date })
	updatedAt: Date

	@ApiPropertyOptional({ type: Date })
	deletedAt?: Date

	@ApiProperty({ type: String })
	authorId: string
}
