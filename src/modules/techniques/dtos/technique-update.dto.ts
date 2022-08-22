import { ArgsType, Field, ID, InputType, Int } from "@nestjs/graphql";

@InputType()
export class TechniqueUpdateDto {
  constructor(obj?: Partial<TechniqueUpdateDto>) {
    Object.assign(this, obj);
  }

  @Field((type) => Int)
  id: number;

}
