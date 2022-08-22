import { ArgsType, Field, ID, InputType, Int } from "@nestjs/graphql";

@InputType()
export class IngredientUpdateDto {
  constructor(obj?: Partial<IngredientUpdateDto>) {
    Object.assign(this, obj);
  }

  @Field((type) => Int)
  id: number;

}
