import { ArgsType, Field, Int } from "@nestjs/graphql";
import { BaseListArgs } from '@src/common/dto/base-list-args'

@ArgsType()
export class GlassListArgs extends BaseListArgs {

  constructor(obj?: Partial<GlassListArgs>) {
    super();
    Object.assign(this, obj);
  }
}