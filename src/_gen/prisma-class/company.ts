import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Author } from "./author";

@ObjectType()
export class Company {
  @Field((type) => ID)
  @ApiProperty({ type: String })
  id: string;

  @Field((type) => String)
  @ApiProperty({ type: String })
  name: string;

  @Field((type) => String)
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Field((type) => String)
  @ApiProperty({ type: Date })
  updatedAt: Date;

  @Field((type) => String, { nullable: true })
  @ApiPropertyOptional({ type: Date })
  deletedAt?: Date;

  @Field((type) => [Author])
  @ApiProperty({ isArray: true, type: () => Author })
  authors: Author[];
}
