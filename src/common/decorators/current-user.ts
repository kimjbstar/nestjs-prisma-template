import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApplicationRequest,
  ApplicationSessionData,
} from "@src/modules/auth/auth.service";

export const currentUser = createParamDecorator(
  (isStrict = true, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ApplicationRequest>();
    const session: ApplicationSessionData = request.session;
    if (!session.user && isStrict) {
      throw new UnauthorizedException("로그인되어 있지 않습니다.");
    }
    return session.user;
  }
);

export const CurrentUser = currentUser;
