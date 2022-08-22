import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CocktailCreateDto {
  constructor(obj?: Partial<CocktailCreateDto>) {
    Object.assign(this, obj);
  }

  @Field()
  name: string;
}
