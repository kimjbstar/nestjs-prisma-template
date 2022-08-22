import { ArgsType, Field, ID, InputType, Int } from "@nestjs/graphql";

@InputType()
export class GlassUpdateDto {
  constructor(obj?: Partial<GlassUpdateDto>) {
    Object.assign(this, obj);
  }

  @Field((type) => Int)
  id: number;

}
