import { ObjectType } from "@nestjs/graphql";
import PaginatedResponse from "@src/common/dto/responses";
import { Technique } from "@src/_gen/prisma-class/technique";

@ObjectType()
export class PaginatedTechniqueResponse extends PaginatedResponse(Technique) {}