import { ArgsType, Field, Int } from "@nestjs/graphql";
import { BaseListArgs } from '@src/common/dto/base-list-args'

@ArgsType()
export class CocktailListArgs extends BaseListArgs {

  constructor(obj?: Partial<CocktailListArgs>) {
    super();
    Object.assign(this, obj);
  }
}