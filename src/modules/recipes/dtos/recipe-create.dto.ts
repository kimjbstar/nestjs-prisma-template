import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class RecipeCreateDto {
  constructor(obj?: Partial<RecipeCreateDto>) {
    Object.assign(this, obj);
  }

  @Field()
  name: string;
}
