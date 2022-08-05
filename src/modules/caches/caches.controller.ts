import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { NormalResult } from '@src/common/dto/responses'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { CachesService } from './caches.service'

class SetCacheQuery {
	@IsNotEmpty()
	key: string

	@IsNotEmpty()
	value: any
}

class GetCacheQuery {
	@IsNotEmpty()
	key: string
}

class GetCacheKeysQuery {
	@IsOptional()
	pattern: string = undefined
}

@Controller('caches')
@ApiTags('caches')
export class CachesController {
	constructor(private readonly cacheService: CachesService) {}

	@Get('store')
	@ApiOperation({
		summary:
			'현재 셋업되어있는 cache의 store 정보를 리턴합니다. (ex: redis)',
	})
	getHello(): NormalResult {
		return new NormalResult({
			storeName: this.cacheService.store()['name'],
		})
	}

	@Get('keys')
	@ApiOperation({
		summary: 'cache의 key 목록을 리턴합니다.',
	})
	async keys(@Query() query: GetCacheKeysQuery): Promise<NormalResult> {
		const keys = await this.cacheService.keys(query.pattern)
		return new NormalResult({
			keys,
		})
	}

	@Get('get')
	@ApiOperation({
		summary: 'query의 key 값에 해당하는 캐시 값을 리턴합니다.',
	})
	async get(@Query() query: GetCacheQuery): Promise<NormalResult> {
		const { key } = query
		return new NormalResult({
			storeName: this.cacheService.store()['name'],
			key,
			result: await this.cacheService.get(key),
		})
	}

	@Get('set')
	@ApiOperation({
		summary: 'query의 key 값에 해당하는 캐시에 데이터를 셋합니다.',
	})
	async set(@Query() query: SetCacheQuery): Promise<NormalResult> {
		const { key, value } = query
		return new NormalResult({
			storeName: this.cacheService.store()['name'],
			key,
			value,
			result: await this.cacheService.set(key, value),
		})
	}

	@Get('del')
	@ApiOperation({
		summary: 'query의 key 값에 해당하는 캐시 데이터를 삭제합니다.',
	})
	async del(@Query() query: GetCacheQuery): Promise<NormalResult> {
		if (CachesService.RESERVED_KEYS[query.key]) {
			throw new BadRequestException('예약된 키는 삭제할 수 없습니다.')
		}
		return new NormalResult({
			storeName: this.cacheService.store()['name'],
			key: query.key,
			result: await this.cacheService.delete(query.key),
		})
	}

	@Get('reset')
	@ApiOperation({
		summary: '캐시를 리셋합니다.',
	})
	async reset(): Promise<NormalResult> {
		await this.cacheService.reset()
		await this.cacheService.setDefault()
		const keys = await this.cacheService.keys()
		const result = {}
		for (const key of keys) {
			result[key] = await this.cacheService.get(key)
		}
		return new NormalResult({
			storeName: this.cacheService.store()['name'],
			result,
		})
	}
}
