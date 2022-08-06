import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class User {
	@ApiProperty({ type: String })
	id: string

	@ApiProperty({ type: String })
	email: string

	@ApiProperty({ type: String })
	password: string

	@ApiProperty({ type: String })
	salt: string

	@ApiProperty({ type: String })
	name: string

	@ApiPropertyOptional({ type: String })
	addressRoad?: string

	@ApiPropertyOptional({ type: String })
	addressDetail?: string

	@ApiProperty({ type: Date })
	createdAt: Date

	@ApiProperty({ type: Date })
	updatedAt: Date

	@ApiPropertyOptional({ type: Date })
	deletedAt?: Date
}
