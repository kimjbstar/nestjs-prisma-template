import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Session,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiNormalResponse } from "@src/common/decorators/api-normal-response";
import { NormalResult } from "@src/common/dto/responses";
import { AuthService, ApplicationSessionData } from "./auth.service";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiNormalResponse({
    description: "현재 세션정보를 확인합니다.",
  })
  @Get("current")
  async current(
    @Session() session: ApplicationSessionData
  ): Promise<NormalResult> {
    return new NormalResult({
      session,
    });
  }

  @Get("hash")
  async hash(@Query("password") password) {
    if (!password) {
      return new BadRequestException();
    }
    const { hashed, salt } = await this.authService.encrypt(password);
    return new NormalResult({ hashed, salt });
  }
}
