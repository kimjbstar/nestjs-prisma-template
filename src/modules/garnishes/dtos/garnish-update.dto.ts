import { ArgsType, Field, ID, InputType, Int } from "@nestjs/graphql";

@InputType()
export class GarnishUpdateDto {
  constructor(obj?: Partial<GarnishUpdateDto>) {
    Object.assign(this, obj);
  }

  @Field((type) => Int)
  id: number;

}
