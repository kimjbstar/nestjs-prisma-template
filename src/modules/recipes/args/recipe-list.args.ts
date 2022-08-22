import { ArgsType, Field, Int } from "@nestjs/graphql";
import { BaseListArgs } from '@src/common/dto/base-list-args'

@ArgsType()
export class RecipeListArgs extends BaseListArgs {

  constructor(obj?: Partial<RecipeListArgs>) {
    super();
    Object.assign(this, obj);
  }
}