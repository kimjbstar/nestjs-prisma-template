import {
	Injectable,
	OnApplicationBootstrap,
	OnModuleInit,
} from '@nestjs/common'

@Injectable()
export class AppService implements OnApplicationBootstrap, OnModuleInit {
	constructor() {}

	getHello(): string {
		return 'Hello World!!'
	}

	async onModuleInit() {
		// console.log('onModuleInit')
	}

	async onApplicationBootstrap() {
		// console.log('onApplicationBootstrap')
	}
}
