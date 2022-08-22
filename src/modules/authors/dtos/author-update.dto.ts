import { ArgsType, Field, ID, InputType, Int } from "@nestjs/graphql";

@InputType()
export class AuthorUpdateDto {
  constructor(obj?: Partial<AuthorUpdateDto>) {
    Object.assign(this, obj);
  }

  @Field((type) => Int)
  id: number;

  @Field({ nullable: true })
  name: string;
}
