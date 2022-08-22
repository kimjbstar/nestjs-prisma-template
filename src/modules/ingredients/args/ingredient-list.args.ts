import { ArgsType, Field, Int } from "@nestjs/graphql";
import { BaseListArgs } from '@src/common/dto/base-list-args'

@ArgsType()
export class IngredientListArgs extends BaseListArgs {

  constructor(obj?: Partial<IngredientListArgs>) {
    super();
    Object.assign(this, obj);
  }
}