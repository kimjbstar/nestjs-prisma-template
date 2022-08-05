import { CACHE_MANAGER, forwardRef, Inject, Injectable } from '@nestjs/common'
import { CustomException } from '@src/common/exceptions/filters/custom.exception-filters'
import { BaseLoggerService } from '@src/modules/base-logger/base-logger.service'
import { UtilService } from '@src/modules/util/util.service'
import { Cache, CachingConfig } from 'cache-manager'

@Injectable()
export class CachesService {
	constructor(
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		private readonly baseLoggerService: BaseLoggerService,
		@Inject(forwardRef(() => UtilService))
		private readonly utilService: UtilService,
	) {}

	static RESERVED_KEYS = {
		'default-message-platform': {
			editable: true,
			default: 'kakao',
		},
		// 인성 데이터 조회 시 기본 페이지 사이즈
		'insung-list-limit': {
			editable: true,
			default: 50,
		},
		// 인성 주문 상시 싱크 날짜 범위,
		'insung-min-sync-date': {
			editable: true,
			default: 1,
		},
		// 마지막 싱크 날짜, 변경 불가능
		'last-kakao-template-synced-at': {
			editable: false,
			default: null,
		},
	} as const

	async get<T>(key: string, reject = false): Promise<T> {
		const value = await this.cacheManager.get<T>(key)
		if (value === null && reject === true) {
			throw new CustomException({
				code: 'CONFIG_NOT_VALID',
				exampleMessage: '해당하는 키에 설정 데이터가 없습니다.',
			})
		}
		return value
	}

	async setIfEmpty<T>(
		key: string,
		value: T,
		_option?: CachingConfig,
	): Promise<T> {
		const old = await this.cacheManager.get<T>(key)
		if (old) {
			return old
		}
		return await this.set<T>(key, value, _option)
	}

	async set<T>(key: string, value: T, _option?: CachingConfig): Promise<T> {
		const option = _option ?? {
			ttl: 0,
		}
		const saved = await this.cacheManager.set<T>(key, value, option)
		// this.baseLoggerService.warn(
		// 	`[CachesService] SET CACHE '${key}' => ${value}`,
		// )
		return saved
	}

	async delete(key: string): Promise<void> {
		if (this.store()['name'] === 'memory') {
			if (!CachesService.RESERVED_KEYS[key]) {
				await this.cacheManager.del(key)
			}
			return
		}
		const keys = (await this.keys(key)) as any[]
		for (const key of keys) {
			if (CachesService.RESERVED_KEYS[key]) continue
			await this.cacheManager.store.del(key)
		}
	}

	async reset(): Promise<void> {
		return await this.cacheManager.reset()
	}

	async keys(arg?: any): Promise<any> {
		return arg
			? await this.cacheManager.store.keys(arg)
			: await this.cacheManager.store.keys()
	}

	store() {
		return this.cacheManager.store
	}

	async setDefault() {
		const cacheKeysToInit = Object.entries(
			CachesService.RESERVED_KEYS,
		).filter(([k, v]) => v.editable)
		for (const [k, v] of cacheKeysToInit) {
			await this.setIfEmpty(k, v.default)
		}
		if (
			this.utilService.isLocal() === true ||
			this.utilService.isTest() === true
		) {
			await this.set('default-message-platform', 'slack')
		}

		this.baseLoggerService.debug('cache set done')
	}
}
