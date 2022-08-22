import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class GlassCreateDto {
  constructor(obj?: Partial<GlassCreateDto>) {
    Object.assign(this, obj);
  }

  @Field()
  name: string;
}
