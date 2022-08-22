import { ObjectType } from "@nestjs/graphql";
import PaginatedResponse from "@src/common/dto/responses";
import { Cocktail } from "@src/_gen/prisma-class/cocktail";

@ObjectType()
export class PaginatedCocktailResponse extends PaginatedResponse(Cocktail) {}