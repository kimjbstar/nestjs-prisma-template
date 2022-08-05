import { BadRequestException, Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiNormalResponse } from "@src/common/decorators/api-normal-response";
import { NormalResult } from "@src/common/dto/responses";
import CUSTOM_CODE_MAP from "@src/common/exceptions/custom-code-map";
import { CustomException } from "@src/common/exceptions/filters/custom.exception-filters";
import { TokenExpiredException } from "../common/exceptions/http-exceptions";
import moment from "moment";
import { PrismaNotFoundError } from "../common/exceptions/filters/prisma-not-found.exception-filters";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaService } from "../modules/prisma/prisma.service";

@Controller("exception")
@ApiTags("exception")
export class ExceptionController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get("custom")
  @ApiNormalResponse({
    description: "의도적으로 CustomException을 발생시켜 리턴합니다.",
  })
  async custom(): Promise<NormalResult> {
    throw new CustomException({
      code: "HELLO_WORLD",
    });
  }

  @Get("bad_request")
  @ApiNormalResponse({
    description: "의도적으로 BadRequestException 발생시켜 리턴합니다.",
  })
  async badRequest(): Promise<NormalResult> {
    throw new BadRequestException("name이 없습니다.");
  }

  @Get("custom_map")
  async getCustomCodeMap(): Promise<NormalResult> {
    return new NormalResult({
      result: CUSTOM_CODE_MAP,
    });
  }

  @Get("token_expired_at")
  async tokenExpiredAt(): Promise<any> {
    throw new TokenExpiredException(moment().unix());
  }

  @Get("prisma_not_found")
  async prismaNotFound() {
    throw new PrismaNotFoundError({
      message: "a",
      name: "b",
    });
  }

  @Get("prisma")
  async prisma() {
    throw new PrismaClientKnownRequestError("fk 연결 에러", "P9999", "1.x.x");
  }

  @Get("just")
  async just() {
    throw new Error("default error");
  }
}
