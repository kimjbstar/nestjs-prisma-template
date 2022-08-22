import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class AuthorCreateDto {
  constructor(obj?: Partial<AuthorCreateDto>) {
    Object.assign(this, obj);
  }

  @Field((type) => Int)
  companyId: number;

  @Field()
  name: string;
}
