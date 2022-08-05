import {
	PostCategory,
	Prisma,
	PrismaClient,
	PrismaPromise,
} from '@prisma/client'
import * as path from 'path'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { CustomException } from '@src/common/exceptions/filters/custom.exception-filters'
import { PrismaNotFoundError } from '@src/common/exceptions/filters/prisma-not-found.exception-filters'
import moment from 'moment'
import { camelCase } from 'change-case'
import { FindManyArgs } from '@src/common/base.repository'
import { BaseListArgs } from '@src/common/dto/base-list-args'

export type HistoryJsonField = {
	message: string
	timestamp: string
	value?: string
}

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	publicPath: string
	constructor() {
		super({
			rejectOnNotFound: {
				findUnique: (e) => {
					throw new PrismaNotFoundError(e)
				},
			},
		})
		this.$use(async (params, next) => {
			if (
				params.model === 'MileageTransaction' &&
				params.action === 'delete'
			) {
				throw new CustomException({
					code: 'PRISMA_ROW_CANNOT_DESTROY',
				})
			}
			return await next(params)
		})
		this.publicPath = path.join(__dirname, '../../public')
	}

	async onModuleInit() {
		await this.$connect()
	}

	async onModuleDestroy() {
		await this.$disconnect()
	}

	async truncateAll() {
		if (
			process.env.NODE_ENV !== 'test' &&
			process.env.NODE_ENV !== 'local'
		) {
			throw new CustomException({
				code: 'AVAILABLE_IN_ONLY_LOCAL',
			})
		}

		const databaseName =
			process.env.NODE_ENV === 'test' ? 'testing' : 'logipasta'
		const transactions: PrismaPromise<any>[] = []
		transactions.push(this.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`)

		const result = await this.$queryRawUnsafe<
			{
				tableName: string
			}[]
		>(
			`SELECT TABLE_NAME as tableName from information_schema.TABLES WHERE TABLE_SCHEMA = '${databaseName}';`,
		)

		for (const { tableName } of result) {
			if (tableName !== '_prisma_migrations') {
				try {
					transactions.push(
						this.$executeRawUnsafe(`TRUNCATE \`${tableName}\`;`),
					)
				} catch (error) {
					console.log({ error })
				}
			}
		}

		transactions.push(this.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`)

		try {
			await this.$transaction(transactions)
		} catch (error) {
			console.log({ error })
		}
	}

	concatHistoryJson(
		_src: Prisma.JsonValue,
		_dst: Omit<HistoryJsonField, 'timestamp'>,
	): Prisma.InputJsonArray {
		const src: Prisma.JsonArray = !Array.isArray(_src) ? [_src] : _src
		const dst: HistoryJsonField = {
			..._dst,
			timestamp: moment().toISOString(),
		}
		return [...src, dst as Prisma.JsonObject]
	}

	/** statement 스트링 리턴 */
	parseWhere(key: string, value: Object | string | number): string {
		if (typeof value === 'string') {
			return `${key} = '${value}'`
		}
		if (typeof value === 'number') {
			return `${key} = ${value}`
		}
		if (value === null) {
			return `${key} IS NULL`
		}
		let result = []

		if (key === 'AND' || key === 'OR') {
			const arr = Array.isArray(value) ? value : [value]
			const inner = []
			for (const arrRow of arr) {
				inner.push(
					Object.entries(arrRow)
						.map(([k, v]) => this.parseWhere(k, v))
						.join(` ${key} `),
				)
			}
			result.push(`(${inner.join(` ${key} `)})`)
		}
		if (key === 'NOT') {
			const arr = Array.isArray(value) ? value : [value]
			const inner = []
			for (const arrRow of arr) {
				const aa = Object.entries(arrRow)
					.map(([k, v]) => this.parseWhere(k, v))
					.join(` ${key} `)
				inner.push(`(NOT ${aa})`)
			}
			result.push(`(${inner.join(` AND `)})`)
		}

		if (value['not']) {
			const arr = this.parseNot(value['not'])
			arr.forEach((arrRow) => {
				value[arrRow.operator] = arrRow.value
			})
		}

		Object.entries(value).forEach(([k, v]) => {
			if (k === 'in') {
				result.push(
					`\`${key}\` IN (${v.map((v) => `'${v}'`).join(',')})`,
				)
			} else if (k === 'notIn') {
				result.push(
					`\`${key}\` NOT IN (${v.map((v) => `'${v}'`).join(',')})`,
				)
			} else if (k === 'equals') {
				result.push(`\`${key}\` = '${v}'`)
			} else if (k === 'notEquals') {
				result.push(`\`${key}\` <> '${v}'`)
			} else if (k === 'contains') {
				result.push(`\`${key}\` LIKE '%${v}%'`)
			} else if (k === 'notContains') {
				result.push(`\`${key}\` NOT LIKE '%${v}%'`)
			} else if (k === 'lt') {
				result.push(`\`${key}\` < '${v}'`)
			} else if (k === 'lte') {
				result.push(`\`${key}\` <= '${v}'`)
			} else if (k === 'gt') {
				result.push(`\`${key}\` > '${v}'`)
			} else if (k === 'gte') {
				result.push(`\`${key}\` >= '${v}'`)
			} else if (k === 'startsWith') {
				result.push(`\`${key}\` LIKE '%${v}'`)
			} else if (k === 'endsWith') {
				result.push(`\`${key}\` LIKE '${v}%'`)
			} else if (k === 'notStartsWith') {
				result.push(`\`${key}\` NOT LIKE '%${v}'`)
			} else if (k === 'notEndsWith') {
				result.push(`\`${key}\` NOT LIKE '${v}%'`)
			}
		})
		return result.join(' AND ')
	}

	parseNot(where: Object | string): {
		operator: string
		value: any
	}[] {
		if (typeof where === 'string') {
			return [
				{
					operator: 'notEquals',
					value: where,
				},
			]
		}
		const PLAIN_KEY_REVERSE_MAP = {
			equals: 'notEquals',
			lt: 'gte',
			gt: 'lte',
			contains: 'notContains',
			startsWith: 'notStartsWith',
			endsWith: 'notEndsWith',
			notEquals: 'equals',
			gte: 'lt',
			lte: 'gt',
			notContains: 'contains',
			notStartsWith: 'startsWith',
			notEndsWith: 'endsWith',
			not: 'notEquals',
		}
		return Object.entries(where).reduce((result, [k, v]) => {
			if (typeof v === 'object') {
				result.push(...this.parseNot(v))
			} else {
				result.push({
					operator: PLAIN_KEY_REVERSE_MAP[k],
					value: v,
				})
			}

			return result
		}, [])
	}

	/**
	 * 테이블명에 해당하는 테이블의 모든 데이터를 삭제하고 초기화합니다.
	 * @param modelName
	 * @param rejectOnFail
	 */
	async truncateTable(modelName: string, rejectOnFail = false) {
		try {
			await this.$queryRawUnsafe(
				`DELETE From \`${modelName}\` where id > 0`,
			)
			await this.$queryRawUnsafe(
				`ALTER TABLE \`${modelName}\` AUTO_INCREMENT=1`,
			)
		} catch (e) {
			if (rejectOnFail) {
				throw e
			} else {
				console.error(e)
			}
		}
	}

	async findUniquePost(id: number) {
		const post = await this.post.findUnique({
			where: { id },
			include: {
				company: true,
				shipper: true,
				user: true,
				postCategory: true,
			},
		})
		if (post.deletedAt) {
			throw new CustomException({
				code: 'POST_DELETED',
			})
		}
		return post
	}

	async findFirstPost(args: Prisma.PostWhereInput, reject = false) {
		const post = await this.post.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
			include: {
				company: true,
				shipper: true,
				user: true,
				postCategory: true,
			},
		})
		if (post.deletedAt) {
			throw new CustomException({
				code: 'POST_DELETED',
			})
		}
		return post
	}

	async findUniqueCompany(id: number) {
		const company = await this.company.findUnique({
			where: { id },
			include: {
				accounts: true,
				pricepolicies: {
					orderBy: {
						sequence: 'asc',
					},
					include: {
						pricePolicy: true,
					},
				},
				callcenter: true,
			},
		})
		return company
	}

	async findFirstCompany(args: Prisma.CompanyWhereInput, reject = false) {
		const company = await this.company.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
			include: {
				accounts: true,
				pricepolicies: {
					orderBy: {
						sequence: 'asc',
					},
					include: {
						pricePolicy: true,
					},
				},
				callcenter: true,
			},
		})
		return company
	}

	async findUniqueShipper(id: number) {
		const shipper = await this.shipper.findUnique({
			where: { id },
			include: {
				company: {
					include: {
						callcenter: true,
					},
				},
			},
		})
		return shipper
	}

	async findFirstShipper(args: Prisma.ShipperWhereInput, reject = false) {
		const shipper = await this.shipper.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
			include: {
				company: {
					include: {
						callcenter: true,
					},
				},
			},
		})
		return shipper
	}

	getPostCategoryChildrenInclude(depth: number): Prisma.PostCategoryInclude {
		if (depth <= 1) {
			return {
				children: true,
			}
		}
		return {
			children: {
				include: this.getPostCategoryChildrenInclude(depth - 1),
			},
		}
	}

	async findUniquePostCategory(id: number, depth = 3) {
		const include = this.getPostCategoryChildrenInclude(depth)
		include.parent = true
		const postCategory = await this.postCategory.findUnique({
			where: { id },
			include,
		})
		return postCategory
	}

	async findFirstPostCategory(
		args: Prisma.PostCategoryWhereInput,
		reject = false,
	) {
		const postCategory = await this.postCategory.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return postCategory
	}

	async getChildrenIds(id: number): Promise<number[]> {
		const category = (await this.findUniquePostCategory(
			id,
		)) as PostCategory & {
			children: PostCategory[]
		}
		let result = [category.id]
		for (const child of category.children) {
			const ids = await this.getChildrenIds(child.id)
			result = result.concat(ids)
		}
		return result
	}

	async findUniqueUser(id: number) {
		const user = await this.user.findUnique({
			where: { id },
			include: {
				company: {
					include: {
						callcenter: true,
					},
				},
				shipper: true,
				addresses: true,
			},
		})
		return user
	}

	async findFirstUser(args: Prisma.UserWhereInput, reject = false) {
		const user = await this.user.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
			include: {
				company: {
					include: {
						callcenter: true,
					},
				},
				shipper: true,
				addresses: true,
			},
		})
		return user
	}

	async findUniqueAdministrator(id: number) {
		const administrator = await this.administrator.findUnique({
			select: {
				id: true,
				user: true,
				companyId: true,
				company: true,
				shipperId: true,
				shipper: true,
				status: true,
				type: true,
				role: true,
				uid: true,
				name: true,
				phone: true,
				email: true,
				desc: true,
				address: true,
				department: true,
				position: true,
				isPasswordReset: true,
				createdAt: true,
				updatedAt: true,
				deletedAt: true,
			},
			where: { id },
		})
		return administrator
	}

	async findFirstAdministrator(
		args: Prisma.AdministratorWhereInput,
		reject = false,
	) {
		const administrator = await this.administrator.findFirst({
			select: {
				id: true,
				user: true,
				companyId: true,
				company: true,
				shipperId: true,
				shipper: true,
				status: true,
				type: true,
				role: true,
				uid: true,
				name: true,
				phone: true,
				email: true,
				desc: true,
				address: true,
				department: true,
				position: true,
				isPasswordReset: true,
				createdAt: true,
				updatedAt: true,
				deletedAt: true,
			},
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return administrator
	}

	async findUniqueAddress(id: number) {
		const address = await this.address.findUnique({
			where: { id },
			include: {
				user: true,
				target: true,
			},
		})
		return address
	}

	async findFirstAddress(args: Prisma.AddressWhereInput, reject = false) {
		const address = await this.address.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return address
	}

	async findUniqueAccount(id: number) {
		const account = await this.account.findUnique({
			where: { id },
		})
		return account
	}

	async findFirstAccount(args: Prisma.AccountWhereInput, reject = false) {
		const account = await this.account.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return account
	}

	async findUniquePricePolicy(id: number) {
		const pricePolicy = await this.pricePolicy.findUnique({
			where: { id },
		})
		return pricePolicy
	}

	async findFirstPricePolicy(
		args: Prisma.PricePolicyWhereInput,
		reject = false,
	) {
		const pricePolicy = await this.pricePolicy.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return pricePolicy
	}

	async findUniqueVehicle(id: number) {
		const vehicle = await this.vehicle.findUnique({
			where: { id },
		})
		return vehicle
	}

	async findFirstVehicle(args: Prisma.VehicleWhereInput, reject = false) {
		const vehicle = await this.vehicle.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return vehicle
	}

	async findUniqueCoupon(id: number) {
		const coupon = await this.coupon.findUnique({
			where: { id },
			include: {
				user: true,
				couponProduct: {
					include: {
						brand: true,
						category: true,
					},
				},
			},
		})
		return coupon
	}

	async findFirstCoupon(args: Prisma.CouponWhereInput, reject = false) {
		const coupon = await this.coupon.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
			include: {
				user: true,
				couponProduct: {
					include: {
						brand: true,
						category: true,
					},
				},
			},
		})
		return coupon
	}

	async findUniqueCallcenter(id: number) {
		const callcenter = await this.callcenter.findUnique({
			where: { id },
		})
		return callcenter
	}

	async findFirstCallcenter(
		args: Prisma.CallcenterWhereInput,
		reject = false,
	) {
		const callcenter = await this.callcenter.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return callcenter
	}

	async findUniqueCouponProduct(id: number) {
		const couponProduct = await this.couponProduct.findUnique({
			where: { id },
			include: {
				brand: true,
				category: true,
			},
		})
		return couponProduct
	}

	async findFirstCouponProduct(
		args: Prisma.CouponProductWhereInput,
		reject = false,
	) {
		const couponProduct = await this.couponProduct.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
			include: {
				brand: true,
				category: true,
			},
		})
		return couponProduct
	}

	async findUniqueCouponProductBrand(id: number) {
		const couponProductBrand = await this.couponProductBrand.findUnique({
			where: { id },
		})
		return couponProductBrand
	}

	async findFirstCouponProductBrand(
		args: Prisma.CouponProductBrandWhereInput,
		reject = false,
	) {
		const couponProductBrand = await this.couponProductBrand.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return couponProductBrand
	}

	async findUniqueCouponProductCategory(id: number) {
		const couponProductCategory =
			await this.couponProductCategory.findUnique({
				where: { id },
			})
		return couponProductCategory
	}

	async findFirstCouponProductCategory(
		args: Prisma.CouponProductCategoryWhereInput,
		reject = false,
	) {
		const couponProductCategory =
			await this.couponProductCategory.findFirst({
				where: args,
				rejectOnNotFound: this.throwOrNot(reject),
			})
		return couponProductCategory
	}

	async findUniqueExtraPreset(id: number) {
		const extraPreset = await this.extraPreset.findUnique({
			where: { id },
			include: {
				steps: {
					include: {
						units: true,
					},
				},
			},
		})
		return extraPreset
	}

	async findFirstExtraPreset(
		args: Prisma.ExtraPresetWhereInput,
		reject = false,
	) {
		const extraPreset = await this.extraPreset.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
			include: {
				steps: {
					include: {
						units: true,
					},
				},
			},
		})
		return extraPreset
	}

	async findUniqueKakaoTemplate(id: number) {
		const kakaoTemplate = await this.kakaoTemplate.findUnique({
			where: { id },
		})
		return kakaoTemplate
	}

	async findFirstKakaoTemplate(
		args: Prisma.KakaoTemplateWhereInput,
		reject = false,
	) {
		const kakaoTemplate = await this.kakaoTemplate.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return kakaoTemplate
	}

	async findUniqueMessageCase(id: number) {
		const messageCase = await this.messageCase.findUnique({
			where: { id },
		})
		return messageCase
	}

	async findFirstMessageCase(
		args: Prisma.MessageCaseWhereInput,
		reject = false,
	) {
		const messageCase = await this.messageCase.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return messageCase
	}

	async findUniqueMessageScenario(id: number) {
		const messageScenario = await this.messageScenario.findUnique({
			where: { id },
			include: {
				company: true,
				messageCase: true,
				kakaoTemplate: true,
			},
		})
		return messageScenario
	}

	async findFirstMessageScenario(
		args: Prisma.MessageScenarioWhereInput,
		reject = false,
	) {
		const messageScenario = await this.messageScenario.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
			include: {
				company: true,
				messageCase: true,
				kakaoTemplate: true,
			},
		})
		return messageScenario
	}

	async findUniqueOrder(id: number) {
		const order = await this.order.findUnique({
			where: { id },
			include: {
				company: {
					include: {
						accounts: true,
					},
				},
				shipper: true,
				user: true,
				vehicle: true,
				callcenter: true,
			},
		})
		return order
	}

	async findFirstOrder(args: Prisma.OrderWhereInput, reject = false) {
		const order = await this.order.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
			include: {
				company: {
					include: {
						accounts: true,
					},
				},
				shipper: true,
				user: true,
				vehicle: true,
				callcenter: true,
			},
		})
		return order
	}

	async findUniqueDistancePrice(id: number) {
		const distancePrice = await this.distancePrice.findUnique({
			where: { id },
			include: {
				company: true,
			},
		})
		return distancePrice
	}

	async findFirstDistancePrice(
		args: Prisma.DistancePriceWhereInput,
		reject = false,
	) {
		const distancePrice = await this.distancePrice.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
			include: {
				company: true,
			},
			orderBy: {
				price: 'desc',
			},
		})
		return distancePrice
	}

	/**
	 *
	 * @param reject
	 */
	throwOrNot(reject: boolean): Prisma.RejectOnNotFound {
		if (reject === false) {
			return false
		}
		return (e: Error) => {
			throw new PrismaNotFoundError(e)
		}
	}

	setOrderAndLimit<T extends FindManyArgs, U extends BaseListArgs>(
		prismaFindManyArg: T,
		listArg: U,
	): T {
		prismaFindManyArg.take = listArg.take
		const skip = (listArg.page - 1) * listArg.take
		prismaFindManyArg.skip = !Number.isNaN(skip) ? skip : 0
		prismaFindManyArg.orderBy = prismaFindManyArg.orderBy ?? {}

		if (!listArg.order_by) {
			return prismaFindManyArg
		}
		const { isSuccess, cursorField, direction, cursorFindDirection } =
			this.parseOrderBy(listArg.order_by)
		if (!isSuccess) {
			return prismaFindManyArg
		}

		prismaFindManyArg.orderBy[cursorField] = direction
		if (listArg.after) {
			prismaFindManyArg.where[cursorField] = {
				[cursorFindDirection]: listArg.after,
			}
		}

		return prismaFindManyArg
	}

	parseOrderBy(arg: string): {
		isSuccess: boolean
		cursorField: string
		direction: Prisma.SortOrder
		cursorFindDirection: 'lte' | 'gte'
	} {
		const [rawCursorField, rawDirection] = arg.split('__')

		if (!rawCursorField || !rawDirection) {
			return {
				isSuccess: false,
				cursorField: null,
				direction: null,
				cursorFindDirection: null,
			}
		}
		const direction = rawDirection.toLowerCase()
		if (direction !== 'asc' && direction !== 'desc') {
			return {
				isSuccess: false,
				cursorField: null,
				direction: null,
				cursorFindDirection: null,
			}
		}
		const cursorFindDirection = rawDirection === 'DESC' ? 'lte' : 'gte'
		const cursorField = camelCase(rawCursorField.toLowerCase())

		return {
			isSuccess: true,
			cursorField: cursorField,
			direction: direction,
			cursorFindDirection: cursorFindDirection,
		}
	}

	async findUniqueCompanyCash(id: number) {
		const companyCash = await this.companyCash.findUnique({
			where: { id },
		})
		return companyCash
	}

	async findFirstCompanyCash(
		args: Prisma.CompanyCashWhereInput,
		reject = false,
	) {
		const companyCash = await this.companyCash.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return companyCash
	}

	async findUniqueCompanyRepresent(id: number) {
		const companyRepresent = await this.companyRepresent.findUnique({
			where: { id },
		})
		return companyRepresent
	}

	async findFirstCompanyRepresent(
		args: Prisma.CompanyRepresentWhereInput,
		reject = false,
	) {
		const companyRepresent = await this.companyRepresent.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return companyRepresent
	}

	async findUniqueDistanceFreezingTruckPrice(id: number) {
		const distanceFreezingTruckPrice =
			await this.distanceFreezingTruckPrice.findUnique({
				where: { id },
			})
		return distanceFreezingTruckPrice
	}

	async findFirstDistanceFreezingTruckPrice(
		args: Prisma.DistanceFreezingTruckPriceWhereInput,
		reject = false,
	) {
		const distanceFreezingTruckPrice =
			await this.distanceFreezingTruckPrice.findFirst({
				where: args,
				rejectOnNotFound: this.throwOrNot(reject),
			})
		return distanceFreezingTruckPrice
	}

	async findFirstDistanceSpecialTruckPrice(
		args: Prisma.DistanceSpecialTruckPriceWhereInput,
		reject = false,
	) {
		const distanceSpecialTruckPrice =
			await this.distanceSpecialTruckPrice.findFirst({
				where: args,
				rejectOnNotFound: this.throwOrNot(reject),
			})
		return distanceSpecialTruckPrice
	}

	async findUniqueMileageTransaction(id: number) {
		const mileageTransaction = await this.mileageTransaction.findUnique({
			where: { id },
		})
		return mileageTransaction
	}

	async findFirstMileageTransaction(
		args: Prisma.MileageTransactionWhereInput,
		reject = false,
	) {
		const mileageTransaction = await this.mileageTransaction.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return mileageTransaction
	}

	async findUniqueCompanySkin(id: number) {
		const companySkin = await this.companySkin.findUnique({
			where: { id },
			include: {
				company: true,
			},
		})
		return companySkin
	}

	async findFirstCompanySkin(
		args: Prisma.CompanySkinWhereInput,
		reject = false,
	) {
		const companySkin = await this.companySkin.findFirst({
			where: args,
			include: {
				company: true,
			},
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return companySkin
	}

	async findUniqueCouponEvent(id: number) {
		const post = await this.couponEvent.findUnique({
			where: { id },
		})
		return post
	}

	async findFirstCouponEvent(
		args: Prisma.CouponEventWhereInput,
		reject = false,
	) {
		const post = await this.couponEvent.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
		})
		return post
	}

	async findUniqueCouponEventUser(id: number) {
		const post = await this.couponEventUser.findUnique({
			where: { id },
			include: {
				user: true,
			},
		})
		return post
	}

	async findFirstCouponEventUser(
		args: Prisma.CouponEventUserWhereInput,
		reject = false,
	) {
		const post = await this.couponEventUser.findFirst({
			where: args,
			rejectOnNotFound: this.throwOrNot(reject),
			include: {
				user: true,
			},
		})
		return post
	}
}
