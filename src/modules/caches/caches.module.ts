import { CacheModule, Global, Module } from "@nestjs/common";
import { CachesController } from "./caches.controller";
import { CachesService } from "./caches.service";
import { ConfigModule } from "@nestjs/config";
import { CacheConfigService } from "@src/modules/caches/cache-config.service";

/**
 * ### 캐시 모듈
 *
 * redis 기반의 캐시를 관리하는 모듈입니다.
 */
@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useClass: CacheConfigService,
    }),
  ],
  controllers: [CachesController],
  providers: [CachesService],
  exports: [CachesService],
})
export class CachesModule {
  constructor() {}
}
