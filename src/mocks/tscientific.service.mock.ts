import {
	CouponCreateResponse,
	CouponDetailSearchResponse,
	CouponSendResponse,
} from '@src/modules/tscientific/tscientific.interface'
import moment from 'moment'

export class TscientificServiceMock {
	async create(input: {
		goodsId: string
		orderCnt: number
		trId: string
	}): Promise<CouponCreateResponse> {
		return {
			barcodeNum: moment().unix().toString(),
			orderId: moment().unix().toString().padStart(30, '0'),
			validEndDate: moment().add(30, 'd').format('YYYYMMDD'),
			trId: input.trId,
		}
	}

	async createAndSendSMS(input: {
		goodsId: string
		orderCnt: number
		receiverbobile: string
		userId?: string
		trId: string
	}): Promise<CouponSendResponse> {
		return {
			barcodeNum: moment().unix().toString(),
			orderId: moment().unix().toString().padStart(30, '0'),
			validEndDate: moment().add(30, 'd').format('YYYYMMDD'),
			trId: input.trId,
			receivermobile: input.receiverbobile,
			smsType: '1WAY SMS',
		}
	}

	async getDetail(input: {
		goodsId: string
		barcodeNum: string
	}): Promise<CouponDetailSearchResponse> {
		console.log('[TscientificServiceMock] : getDetail')
		return {
			couponType: 'BARCODE',
			status: '000',
			validEndDate: moment().add(30, 'd').format('YYYYMMDD'),
			exchangeDate: moment().format('YYYYMMDDHHmmSS'),
			cancelDate: moment().format('YYYYMMDDHHmmSS'),
			branchName: '구로디지털단지역점',
			branchCode: '000',
			totalAmount: '100',
			remainAmount: '200',
		}
	}

	async cancel(input: {
		goodsId: string
		barcodeNum: string
	}): Promise<boolean> {
		console.log('[TscientificServiceMock] : cancel')
		return true
	}

	async resendSMS(input: {
		goodsId: string
		barcodeNum: string
		smsType: 'S' | 'L' | 'M'
	}) {
		console.log('[TscientificServiceMock] : resendSMS')
	}

	async changeMdn(input: {
		goodsId: string
		receivermobile: string
		barcodeNum: string
	}) {
		console.log('[TscientificServiceMock] : changeMdn')
	}
}
