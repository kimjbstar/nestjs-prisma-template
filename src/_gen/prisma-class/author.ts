import { Post } from "./post";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Author {
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

  @Field((type) => [Post])
  @ApiProperty({ isArray: true, type: () => Post })
  posts: Post[];
}
