import {
	CacheModuleOptions,
	CacheOptionsFactory,
	Injectable,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'
import * as redis from 'redis'
import { BaseLoggerService } from '../base-logger/base-logger.service'

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
	constructor(
		private readonly configService: ConfigService,
		private readonly baseLoggerService: BaseLoggerService,
	) {}

	client: redis.RedisClient = null

	async createCacheOptions(): Promise<CacheModuleOptions> {
		return new Promise((resolve) => {
			const client = redis.createClient({
				host: this.configService.get('REDIS_HOST'),
				port: this.configService.get<number>('REDIS_PORT'),
				no_ready_check: true,
			})
			setTimeout(() => {
				if (client.connected === false) {
					this.baseLoggerService.error('Redis 연결 실패')
					client.emit('error')
				}
			}, 3000)

			client.on('error', (error) => {
				resolve({})
			})
			client.on('ready', () => {
				let response = client.ping()
				if (response) {
					this.client = client
					resolve({
						store: redisStore,
						host: this.configService.get('REDIS_HOST'),
						port: this.configService.get('REDIS_PORT'),
						isGlobal: true,
					})
				}
			})
		})
	}
}
