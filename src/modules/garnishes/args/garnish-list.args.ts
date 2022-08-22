import { ArgsType, Field, Int } from "@nestjs/graphql";
import { BaseListArgs } from '@src/common/dto/base-list-args'

@ArgsType()
export class GarnishListArgs extends BaseListArgs {

  constructor(obj?: Partial<GarnishListArgs>) {
    super();
    Object.assign(this, obj);
  }
}