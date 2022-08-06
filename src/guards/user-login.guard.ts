import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { CustomException } from "@src/common/exceptions/filters/custom.exception-filters";
import { ApplicationRequest } from "@src/modules/auth/auth.service";
import { Observable } from "rxjs";

/**
 * 유저 로그인 여부 기반 가드
 */
@Injectable()
export class UserLoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ApplicationRequest>();
    if (request.session.user === undefined) {
      throw new CustomException({
        code: "USER_MUST_BE_LOGGED_IN",
      });
    }
    return true;
  }
}
