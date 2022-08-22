import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppService } from "./app.service";
import { ApiNormalResponse } from "./common/decorators/api-normal-response";
import { CurrentIp } from "./common/decorators/current-ip";
import { NormalResult } from "./common/dto/responses";
import { ResponseInterceptor } from "./interceptors/response.interceptor";

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
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Hello, World👋
   * @returns {string} 테스트 hello 메시지.
   */
  @Get()
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
