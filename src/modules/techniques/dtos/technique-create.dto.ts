import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class TechniqueCreateDto {
  constructor(obj?: Partial<TechniqueCreateDto>) {
    Object.assign(this, obj);
  }

  @Field()
  name: string;
}
