import { Global, Module } from "@nestjs/common";
import { UtilService } from "./util.service";

/**
 * ### 유틸 모듈
 *
 * 범용 유틸 펑션 모음 모듈입니다.
 *
 */
@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [UtilService],
  exports: [UtilService],
})
export class UtilModule {}
