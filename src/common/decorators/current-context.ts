import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const currentGraphQLContext = createParamDecorator(
  (data: unknown, context: ExecutionContext): GqlExecutionContext => {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext;
  }
);

export const CurrentGraphQLContext = currentGraphQLContext;
