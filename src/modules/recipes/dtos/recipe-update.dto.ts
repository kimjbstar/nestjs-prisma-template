import { ArgsType, Field, ID, InputType, Int } from "@nestjs/graphql";

@InputType()
export class RecipeUpdateDto {
  constructor(obj?: Partial<RecipeUpdateDto>) {
    Object.assign(this, obj);
  }

  @Field((type) => Int)
  id: number;

}
