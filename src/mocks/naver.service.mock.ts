import { Vehicle } from '@prisma/client'
import {
	NaverDistance,
	NaverDrivingCartype,
	NaverDrivingOptionCode,
	NaverDrivingParams,
	NaverDrivingParamsWithoutStartAndGoal,
	NaverGeocodeElement,
} from '@src/modules/naver/naver.interface'
import { NaverService } from '@src/modules/naver/naver.service'

export class NaverServiceMock {
	async fetch(_url, params) {
		return null
	}
	async fetchGeocodes(input: {
		query: string
		count?: number
	}): Promise<Array<NaverGeocodeElement>> {
		return [
			new NaverGeocodeElement({
				sido: '인천시',
				sigugun: '부평구',
				dongmyun: '부평동',
				ri: '',
				roadName: '968',
				buildingNumber: '',
				buildingName: '',
				landNumber: '',
				postalCode: '',
				road: '인천시 부평구 부평동',
				jibun: '',
				x: 1,
				y: 1,
			}),
		]
	}
	async getGeocodes(query: string): Promise<Array<NaverGeocodeElement>> {
		return await this.fetchGeocodes({ query })
	}
	async getFirstGeocode(
		query: string,
		reject = false,
	): Promise<NaverGeocodeElement> {
		return new NaverGeocodeElement({
			sido: '인천시',
			sigugun: '부평구',
			dongmyun: '부평동',
			ri: '',
			roadName: '968',
			buildingNumber: '',
			buildingName: '',
			landNumber: '',
			postalCode: '',
			road: '인천시 부평구 부평동',
			jibun: '',
			x: 1,
			y: 1,
		})
	}

	async getDistanceFromGeocode(input: {
		start: NaverGeocodeElement
		end: NaverGeocodeElement
		_params: NaverDrivingParamsWithoutStartAndGoal
	}): Promise<NaverDistance> {
		return new NaverDistance({
			distance: 30000,
			duration: 10,
		})
	}

	async getDistanceFromAddress(input: {
		start: string
		end: string
		_params: NaverDrivingParamsWithoutStartAndGoal
	}): Promise<NaverDistance> {
		const { start, end, _params = {} } = input
		const distance = Number(end)
		return new NaverDistance({
			distance: !Number.isNaN(distance)
				? distance * NaverService.KILOMETER_METER_RATIO
				: 0,
			duration: 0,
		})
	}

	async distanceWithVehicle(input: {
		vehicle: Vehicle
		from: string
		to: string
	}) {
		const { vehicle, from, to } = input

		return await this.getDistanceFromAddress({
			start: from,
			end: to,
			_params: {},
		})
	}

	async queryV1LocalStore(query: string): Promise<{
		items: any[]
	}> {
		return null
	}
	async getGeocodesFromLocalStore(
		query: string,
	): Promise<Array<NaverGeocodeElement>> {
		return null
	}
}
