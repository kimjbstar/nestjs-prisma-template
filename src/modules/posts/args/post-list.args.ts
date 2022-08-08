import { ArgsType } from "@nestjs/graphql";
import { BaseListArgs } from "@src/common/dto/base-list-args";

@ArgsType()
export class PostListArgs extends BaseListArgs {}
