import { ObjectType } from "@nestjs/graphql";
import PaginatedResponse from "@src/common/dto/responses";
import { Glass } from "@src/_gen/prisma-class/glass";

@ObjectType()
export class PaginatedGlassResponse extends PaginatedResponse(Glass) {}