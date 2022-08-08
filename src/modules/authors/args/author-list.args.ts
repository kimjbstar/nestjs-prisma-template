import { ArgsType, Field, Int } from "@nestjs/graphql";
import { BaseDTOProperty } from "@src/common/decorators/dto-types";
import { BaseListArgs } from "@src/common/dto/base-list-args";

@ArgsType()
export class AuthorListArgs extends BaseListArgs {
  @Field({ nullable: true })
  name?: string;
}
