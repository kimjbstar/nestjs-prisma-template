import { Author } from "./author";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Post {
  @Field((type) => ID)
  @ApiProperty({ type: String })
  id: string;

  @Field((type) => String)
  @ApiProperty({ type: String })
  name: string;

  @Field((type) => Author, { nullable: true })
  @ApiProperty({ type: () => Author })
  author: Author;

  @Field((type) => String)
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Field((type) => String)
  @ApiProperty({ type: Date })
  updatedAt: Date;

  @Field((type) => String, { nullable: true })
  @ApiPropertyOptional({ type: Date })
  deletedAt?: Date;

  @Field((type) => String)
  @ApiProperty({ type: String })
  authorId: string;
}
