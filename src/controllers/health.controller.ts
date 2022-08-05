import { Controller, Get } from '@nestjs/common'
import { NormalResult } from '@src/common/dto/responses'

@Controller('health')
export class HealthController {
	@Get()
	async healthCheck() {
		return new NormalResult({
			msg: 'this returns 200 whoever i am',
		})
	}
}
