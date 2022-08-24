import { ObjectType } from "@nestjs/graphql";
import PaginatedResponse from "@src/common/dto/responses";
import { User } from "@src/_gen/prisma-class/user";

export class UserResponse {
  user: User;
}

@ObjectType()
export class PaginatedUserResponse extends PaginatedResponse(User) {}
