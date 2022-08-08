import { ArgsType, Field, Int, ObjectType } from "@nestjs/graphql";
import { Min } from "class-validator";
import { BaseDTOProperty } from "../decorators/dto-types";

@ArgsType()
export class BaseListArgs {
  constructor(obj?: object) {
    Object.assign(this, obj);
  }

  @Field({ nullable: true })
  @BaseDTOProperty({
    description:
      "[커서 기반] 특정 커서 이후의 값들을 조회합니다. 반드시 order_by와 함께 사용되어야 합니다.",
    dataType: "NUMBER",
  })
  after?: number = undefined;

  @Field((type) => Int, { nullable: true })
  @BaseDTOProperty({
    description:
      "[페이지네이션 기반, 커서 기반 공용] 몇 건의 엔티티를 조회할지 여부값입니다.",
    dataType: "NUMBER",
    default: 10,
  })
  take?: number = 10;

  @Field((type) => Int, { nullable: true })
  @Min(1)
  @BaseDTOProperty({
    description: "[페이지네이션 기반] 페이지 번호 입니다.",
    dataType: "NUMBER",
    default: 1,
  })
  page?: number = 1;

  @Field({ nullable: true })
  @BaseDTOProperty({
    description: "정렬 순서:필드명__순서 ex) ID__DESC, CREATED_AT__DESC",
  })
  order_by?: string = undefined;

  @BaseDTOProperty({
    description: "count는 raw 쿼리로 실행 (기본값: true)",
    dataType: "BOOLEAN",
  })
  use_raw_count?: boolean = false;
}
