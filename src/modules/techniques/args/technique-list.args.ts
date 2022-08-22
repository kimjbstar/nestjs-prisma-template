import { ArgsType, Field, Int } from "@nestjs/graphql";
import { BaseListArgs } from '@src/common/dto/base-list-args'

@ArgsType()
export class TechniqueListArgs extends BaseListArgs {

  constructor(obj?: Partial<TechniqueListArgs>) {
    super();
    Object.assign(this, obj);
  }
}