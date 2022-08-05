import { WeatherIssueType } from '@src/modules/surcharges/surcharges.enum'
import { WeatherIssue } from '@src/modules/weather/weather.service'
import { NCastResult } from 'korea-public-village-forecast'
import moment from 'moment'

export class WeatherServiceMock {
	async getCurrent(lat: number, lng: number): Promise<NCastResult> {
		return {
			url: 'http://apis.data.go.kr',
			baseDate: moment().format('YYYY-MM-DD HH:mm'),
			items: [
				{
					category: 'PTY',
					value: '0',
					desc: '강수형태',
					valueDesc: '없음',
				},
				{
					category: 'REH',
					value: '80',
					desc: '습도(%)',
				},
				{
					category: 'RN1',
					value: '0',
					desc: '1시간 강수량(mm)',
				},
				{
					category: 'T1H',
					value: '8.9',
					desc: '기온(c)',
				},
				{
					category: 'UUU',
					value: '0.7',
					desc: '풍속(동서성분)',
				},
				{
					category: 'VEC',
					value: '212',
					desc: '풍향(deg)',
					valueDesc: 'S-SW',
				},
				{
					category: 'VVV',
					value: '1.1',
					desc: '풍속(남북성분)',
				},
				{
					category: 'WSD',
					value: '1.3',
					desc: '풍속(m/s)',
				},
			],
			origin: null,
		}
	}

	async getCurrentInIssue(
		lat: number,
		lng: number,
	): Promise<Array<WeatherIssue>> {
		return [
			{
				type: WeatherIssueType.RAIN,
				amount: 10,
			},
			{ type: WeatherIssueType.TEMPERATURE, amount: 20 },
		]
	}
}
