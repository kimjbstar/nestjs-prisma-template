import { NestFactory } from '@nestjs/core'
import { SeedModule } from './modules/seed/seed.module'
import { SeedService } from './modules/seed/seed.service'
;(async function () {
	// TODO : seed 고도화 필요
	// ex) 단위 테스트 등에서느 모든 차량 정보를 셋할 필요가 없음
	// ex) 모든 주선사 정보를 가져올 필요가 없음, 라이브 서버와 통신해야함
	const app = await NestFactory.createApplicationContext(SeedModule, {
		logger: false,
	})
	await app.get(SeedService).setLocal()

	app.close()
	process.exit(0)
})()
