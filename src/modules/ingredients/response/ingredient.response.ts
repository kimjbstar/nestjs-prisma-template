import { ObjectType } from "@nestjs/graphql";
import PaginatedResponse from "@src/common/dto/responses";
import { Ingredient } from "@src/_gen/prisma-class/ingredient";

@ObjectType()
export class PaginatedIngredientResponse extends PaginatedResponse(Ingredient) {}