import { ObjectType } from "@nestjs/graphql";
import PaginatedResponse from "@src/common/dto/responses";
import { Author } from "@src/_gen/prisma-class/author";

@ObjectType()
export class PaginatedAuthorResponse extends PaginatedResponse(Author) {}
