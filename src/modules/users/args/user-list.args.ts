import { ArgsType, Field, registerEnumType } from "@nestjs/graphql";
import { UserRole } from "@prisma/client";
import { BaseListArgs } from "@src/common/dto/base-list-args";

@ArgsType()
export class UserListArgs extends BaseListArgs {
  constructor(obj?: Partial<UserListArgs>) {
    super();
    Object.assign(this, obj);
  }

  @Field((type) => UserRole, { nullable: true })
  role?: UserRole;
}
