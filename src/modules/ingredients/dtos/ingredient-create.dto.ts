import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class IngredientCreateDto {
  constructor(obj?: Partial<IngredientCreateDto>) {
    Object.assign(this, obj);
  }

  @Field()
  name: string;
}
