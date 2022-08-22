import { ArgsType, Field, Int } from "@nestjs/graphql";
import { BaseListArgs } from "@src/common/dto/base-list-args";

@ArgsType()
export class AuthorListArgs extends BaseListArgs {
  @Field({ nullable: true })
  name?: string;

  constructor(obj?: Partial<AuthorListArgs>) {
    super();
    Object.assign(this, obj);
  }
}
