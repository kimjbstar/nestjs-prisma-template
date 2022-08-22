import { ObjectType } from "@nestjs/graphql";
import PaginatedResponse from "@src/common/dto/responses";
import { Recipe } from "@src/_gen/prisma-class/recipe";

@ObjectType()
export class PaginatedRecipeResponse extends PaginatedResponse(Recipe) {}