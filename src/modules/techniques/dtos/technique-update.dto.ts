import { ArgsType, Field, ID, InputType, Int } from "@nestjs/graphql";

@InputType({
  description: "설명 테스트",
})
export class TechniqueUpdateDto {
  constructor(obj?: Partial<TechniqueUpdateDto>) {
    Object.assign(this, obj);
  }

  @Field((type) => Int)
  id: number;
}
