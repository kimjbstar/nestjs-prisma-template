import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

export type ClassConstructorType = new (...args: any[]) => any;

export class NormalResult<T = object> {
  @ApiProperty({
    description: "statusCode",
    example: 200,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: "message",
    example: "OK",
    type: String,
  })
  message: string;

  constructor(obj?: T) {
    this.statusCode = 200;
    this.message = "OK";

    Object.assign(this, obj);
  }
}

export interface ClassType<T = any> {
  new (...args: any[]): T;
}

export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    // here we use the runtime argument
    @Field((type) => [TItemClass])
    // and here the generic type
    items: TItem[];

    @Field((type) => Int, { nullable: true })
    totalCount?: number;

    @Field()
    hasNext: boolean;
  }
  return PaginatedResponseClass;
}
