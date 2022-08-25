import { ArgsType, Field, ID, InputType, Int } from "@nestjs/graphql";

@InputType()
export class GlassUpdateDto {
  constructor(obj?: Partial<GlassUpdateDto>) {
    Object.assign(this, obj);
  }

  @Field((type) => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  name_english?: string;

  @Field({ nullable: true })
  volume?: string;
}
