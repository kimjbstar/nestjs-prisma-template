import { ArgsType, Field, ID, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CocktailUpdateDto {
  constructor(obj?: Partial<CocktailUpdateDto>) {
    Object.assign(this, obj);
  }

  @Field((type) => Int)
  id: number;

}
