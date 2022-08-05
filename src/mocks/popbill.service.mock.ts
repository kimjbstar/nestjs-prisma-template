import {
	ATSTemplate,
	KakaoSentInfo,
	SendATSOneParamters,
	SendATSSameParamters,
	SenderNumber,
} from '@src/modules/popbill/popbill.interface'

export class PopbillServiceMock {
	async getSenderNumberList(): Promise<Array<SenderNumber>> {
		return []
	}
	async getTemplates(): Promise<Array<ATSTemplate>> {
		return []
	}
	async sendATSOne(params: SendATSOneParamters): Promise<string> {
		console.log('sendATSOne')
		console.log(params)
		return null
	}
	async sendATSSame(params: SendATSSameParamters): Promise<string> {
		console.log('sendATSSame')
		console.log(params)
		return null
	}
	async getMessages(receiptNum: string): Promise<KakaoSentInfo> {
		return null
	}
	async getBalance(): Promise<string> {
		return null
	}
	async getChargeURL(): Promise<string> {
		return null
	}
	async syncTemplates() {
		return null
	}
}
