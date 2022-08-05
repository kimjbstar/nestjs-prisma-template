import {
  Controller,
  Get,
  UseInterceptors,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { ApiNormalResponse } from "./common/decorators/api-normal-response";
import { CurrentIp } from "./common/decorators/current-ip";
import { BaseDTOProperty } from "./common/decorators/dto-types";
import { NormalResult } from "./common/dto/responses";
import { ResponseInterceptor } from "./interceptors/response.interceptor";

/**
 * 인성 키 검증에 사용되는 query를 정의한 class입니다.
 */
export class CheckInsungKeyQuery {
  @BaseDTOProperty({
    isRequired: true,
  })
  m_code: string = undefined;

  @BaseDTOProperty({
    isRequired: true,
  })
  cc_code: string = undefined;

  @BaseDTOProperty({
    isRequired: true,
  })
  consumer_key: string = undefined;
}

/**
 * get hello response!!
 */
export class GetHelloResponse {
  hello: string;
}

/**
 * 특정 모듈에 종속되지 않거나, 테스트용 엔드포인트가 있습니다.
 */
@Controller()
@ApiTags("default")
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Hello, World👋
   * @returns {string} 테스트 hello 메시지.
   */
  @Get()
  @ApiOperation({
    summary: "Hello World👋",
  })
  @UseInterceptors(ResponseInterceptor)
  getHello(): GetHelloResponse {
    return {
      hello: this.appService.getHello(),
    };
  }

  /**
   * 현재 실행되어 있는 서버의 NODE_ENV 정보를 출력합니다..
   * @returns {string} env
   */
  @Get("env")
  @ApiNormalResponse({
    models: {
      env: "string",
    },
    description: "현재 실행되어 있는 서버의 NODE_ENV 정보를 출력합니다.",
  })
  @UseInterceptors(ResponseInterceptor)
  getCurrentEnv() {
    return {
      env: this.configService.get<string>("NODE_ENV"),
    };
  }

  /**
   * 현재 ip 정보를 출력합니다.
   * @returns ip
   */
  @Get("check_ip")
  @ApiNormalResponse({
    models: {
      ip: "string",
    },
    description: "현재 ip 정보를 출력합니다.",
  })
  async checkIp(@CurrentIp() ip: string = "255:255:255:255") {
    return new NormalResult({ ip });
  }
}
