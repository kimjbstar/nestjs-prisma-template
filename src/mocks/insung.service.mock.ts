import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import moment from 'moment'
import { Connection, Model } from 'mongoose'
import { InsungAPI } from '@src/modules/insung/insung.interface'
import { Company, CompanyDocument } from '@src/schemas/company.schema'
import { Member, MemberDocument } from '@src/schemas/member.schema'
import { Order, OrderDocument } from '@src/schemas/order.schema'
import { InsungException } from '@src/common/exceptions/filters/insung.exception-filters'
import { NaverGeocodeElement } from '@src/modules/naver/naver.interface'
import members from './data/insung/members'
import companies from './data/insung/companies'
import orders from './data/insung/orders'
import {
	MapOrderPaymentType,
	MapOrderStatus,
	MapOrderSurchargeType,
	MapOrderTripType,
	OrderPaymentTypeFromInsung,
	OrderPaymentTypeToInsung,
	OrderSurchargeTypeFromInsung,
	OrderTripTypeFromInsung,
	OrderVehicleFromInsung,
} from '@src/modules/orders/orders.enum'
import { INSUNG_CODE_TO_TRUCK_NAME } from '@src/modules/vehicles/vehicle-interface'
import { Callcenter } from '@prisma/client'
import { InsungService } from '@src/modules/insung/insung.service'

export class InsungServiceMock {
	constructor() {}
	clean = async () => {}

	getMemberExistWithDetailAPI = async (
		input: InsungAPI.MemberExist.Request,
	): Promise<boolean> => {
		return true
	}

	// fetch = async () => {}
	// getOrders = async (
	// 	input: InsungAPI.OrderList.Request,
	// ): Promise<InsungAPI.OrderList.Response> => {
	// 	const {
	// 		userId,
	// 		fromDate = moment().subtract(1, 'd').hour(0).minute(0).second(0),
	// 		toDate = moment().hour(23).minute(59).second(59),
	// 		page = 1,
	// 		limit = 10,
	// 		state = '10,20,30',
	// 		staffCode,
	// 		deptName,
	// 	} = input
	// 	const orders = await this.orderModel
	// 		.find({
	// 			userId: userId,
	// 			customerCode: staffCode,
	// 			orderStateCode: {
	// 				$in: state.split(','),
	// 			},
	// 		})
	// 		.skip((page - 1) * limit)
	// 		.limit(limit)
	// 	return {
	// 		summary: null,
	// 		orders: orders,
	// 	}
	// }
	// getOrdersDept = async () => {}
	// getCompanies = async () => {}
	// getAddressList = async (
	// 	input: InsungAPI.AddressList.Request,
	// ): Promise<InsungAPI.AddressList.Response[]> => {
	// 	return []
	// }
	// registerAddress = async () => {}
	// deleteAddress = async () => {}
	// getCustomerList = async () => {}

	// login = async (input: InsungAPI.Login.Request) => {
	// 	const member = await this.memberModel.findOne({
	// 		userId: input.userId,
	// 		password: input.password,
	// 	})
	// 	if (member === null) {
	// 		throw new InsungException({
	// 			url: '',
	// 			params: {},
	// 			message: '로그인 실패, 유저 없음',
	// 			result: null,
	// 		})
	// 	}
	// 	return {
	// 		userId: member.userId,
	// 		mCode: '1921',
	// 		ccCode: '11119',
	// 		companyCode: member.compNo,
	// 		companyDepartment: '',
	// 		subTelnoState: 'N',
	// 		userCode: member.cCode,
	// 	}
	// }
	// checkPassword = async () => {}

	// getMemberExist = async (input: InsungAPI.MemberExist.Request) => {
	// 	const oldOne = await this.memberModel.findOne({
	// 		userId: input.userId,
	// 	})
	// 	return oldOne !== null
	// }

	// getMemberDetailFind = async (
	// 	input: InsungAPI.MemberDetailFind.Request,
	// ): Promise<InsungAPI.MemberDetailFind.Response> => {
	// 	const member = await this.memberModel.findOne({
	// 		cCode: input.cCode,
	// 	})

	// 	if (member === null) {
	// 		return null
	// 	}
	// 	return {
	// 		cCode: member.cCode,
	// 		compNo: member.compNo,
	// 		callcenter: member.callcenter,
	// 		telNo1: member.telNo1,
	// 		telNo2: member.telNo2,
	// 		name: member.name,
	// 		email: member.email,
	// 		deptName: member.deptName,
	// 		chargeName: member.chargeName,
	// 		basicDong: member.basicDong,
	// 		location: member.location,
	// 		mileage: member.mileage,
	// 		credit: member.credit,
	// 		creditCode: member.creditCode,
	// 		lon: member.lon,
	// 		lat: member.lat,
	// 		basicMileage: member.basicMileage,
	// 		applyMileage: member.applyMileage,
	// 		mileageState: member.mileageState,
	// 		etc01: member.etc_01,
	// 		remark: member.remark,
	// 		memo: member.memo,
	// 		faxNo: member.faxNo,
	// 		discountType: member.discountType,
	// 		discount: member.discount,
	// 		discountState: member.discountState,
	// 		userId: member.userId,
	// 		registDate: member.registDate,
	// 		registType: member.registType,
	// 		sido: member.sido,
	// 		gugun: member.gugun,
	// 		ri: member.ri,
	// 	}
	// }

	// getMemberDetail = async (input: InsungAPI.MemberDetail.Request) => {
	// 	const member = await this.memberModel.findOne({
	// 		userId: input.userId,
	// 	})

	// 	if (member === null) {
	// 		return null
	// 	}
	// 	return {
	// 		cCode: member.cCode,
	// 		compNo: member.compNo,
	// 		custName: member.name,
	// 		telNumber: member.telNo1,
	// 		sido: member.sido,
	// 		gugun: member.gugun,
	// 		dongName: member.basicDong,
	// 	}
	// }
	// memberModify = async () => {}
	costSearch = async (
		input: InsungAPI.CostSearch.Request,
	): Promise<InsungAPI.CostSearch.Response> => {
		return {
			basicCost: '12,300원',
			addCost: '45,600원',
			totalCost: '78,900원',
		}
	}
	createOrder = async (input: InsungAPI.OrderRegist.Request) => {
		return {
			serialNumber: '123456789',
		}

		// roadCode = async () => {}
		// zipcodeTransform = async () => {}
		// costDistance = async () => {}
		// getAddress = async () => {}
		// register = async (input: InsungAPI.MemberRegist.Request) => {
		// 	const member = await this.memberModel.findOne({
		// 		userId: input.userId,
		// 	})
		// 	if (member !== null) {
		// 		throw new InsungException({
		// 			url: '',
		// 			params: {},
		// 			message: '회원가입 실패',
		// 			result: {},
		// 		})
		// 	}
		// 	if (input.compNo) {
		// 		const customer = await this.connection
		// 			.collection(Company.name)
		// 			.findOne({
		// 				compNo: input.compNo,
		// 			})
		// 		if (!customer) {
		// 			throw new InsungException({
		// 				url: '',
		// 				params: {},
		// 				message: '기업회원가입 실패 - 화주사 없음',
		// 				result: {},
		// 			})
		// 		}
		// 	}
		// 	const newOne = await this.memberModel.create({
		// 		...input,
		// 		cCode: Date.now().toString(),
		// 	})
		// 	return {
		// 		userId: newOne.userId,
		// 		compNo: newOne.compNo,
		// 		departmentName: newOne.deptName,
		// 	}
	}
	// getOrderDetail = async (
	// 	input: InsungAPI.OrderDetail.Request,
	// ): Promise<InsungAPI.OrderDetail.Response> => {
	// 	const order = await this.orderModel.findOne({
	// 		serialNumber: input.serial,
	// 	})
	// 	return {
	// 		customerName: order.customerName,
	// 		customerTelNumber: order.customerTelNumber,
	// 		customerDepartment: order.customerDepartment,
	// 		customerDuty: order.customerDuty,
	// 		riderCodeNo: order.riderCodeNo,
	// 		riderName: order.riderName,
	// 		riderTelNumber: order.riderTelNumber,
	// 		serialNumber: order.serialNumber,
	// 		orderTime: order.orderTime,
	// 		allocationTime: order.allocationTime,
	// 		pickupTime: order.pickupTime,
	// 		reason: order.reason,
	// 		departureDongName: order.departureDongName,
	// 		departureAddress: order.departureAddress,
	// 		departureTelNumber: order.departureTelNumber,
	// 		departureCompanyName: order.departureCompanyName,
	// 		destinationDongName: order.destinationDongName,
	// 		destinationAddress: order.destinationAddress,
	// 		destinationTelNumber: order.destinationTelNumber,
	// 		destinationCompanyName: order.destinationCompanyName,
	// 		summary: order.summary,
	// 		carType: order.carType,
	// 		cargoType: order.cargoType,
	// 		cargoName: order.cargoName,
	// 		payment: order.payment,
	// 		state: order.state,
	// 		saveState: order.saveState,
	// 		totalCost: order.totalCost,
	// 		basicCost: order.basicCost,
	// 		additionCost: order.additionCost,
	// 		discountCost: order.discountCost,
	// 		deliveryCost: order.deliveryCost,
	// 		riderLon: order.riderLon,
	// 		riderLat: order.riderLat,
	// 		completeTime: order.completeTime,
	// 		carNo: order.carNo,
	// 		carWeight: order.carWeight,
	// 		carName: order.carName,
	// 		startLon: order.startLon,
	// 		startLat: order.startLat,
	// 		destLon: order.destLon,
	// 		destLat: order.destLat,
	// 		doc: order.doc,
	// 		itemType: order.itemType,
	// 		sfast: order.sfast,
	// 		startCCode: order.startCCode,
	// 		destCCode: order.destCCode,
	// 		startDepartment: order.startDepartment,
	// 		startDuty: order.startDuty,
	// 		destDepartment: order.destDepartment,
	// 		destDuty: order.destDuty,
	// 		happyCall: order.happyCall,
	// 	}
	// }
	// syncOrdersWithOrderListDept = async () => {}
	// syncOrderByShipper = async () => {}
	// syncEmployeesInShipper = async () => {}
	// getDummyInsungId = async () => {}

	// toDirtyAddress = (src: NaverGeocodeElement) => {
	// 	return {
	// 		sido: '',
	// 		gugun: '',
	// 		dong: '',
	// 	}
	// }

	// // 상태 임의 변경
	// updateOrder = async (serialNumber: string, status: any) => {
	// 	return await this.orderModel.findOneAndUpdate(
	// 		{ serialNumber: serialNumber },
	// 		{ status: status },
	// 	)
	// }

	getTemporaryInsungId = async (callcenter: Callcenter) => {
		return InsungService.NONUSER_PREFIX_ID + moment().format('x')
	}
}
