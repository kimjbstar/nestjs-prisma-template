import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class GarnishCreateDto {
  constructor(obj?: Partial<GarnishCreateDto>) {
    Object.assign(this, obj);
  }

  @Field()
  name: string;
}
