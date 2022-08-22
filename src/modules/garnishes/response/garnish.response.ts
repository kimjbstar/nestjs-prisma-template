import { ObjectType } from "@nestjs/graphql";
import PaginatedResponse from "@src/common/dto/responses";
import { Garnish } from "@src/_gen/prisma-class/garnish";

@ObjectType()
export class PaginatedGarnishResponse extends PaginatedResponse(Garnish) {}