import { IncomingWebhookSendArguments } from '@slack/webhook'
import { SlackWebhookURL } from '@src/modules/slack/slack.service'

export class SlackServiceMock {
	static getWebhook(type: SlackWebhookURL) {
		return
	}
	async sendText(type: SlackWebhookURL, text: string) {
		console.log(type)
		console.log(text)
		return
	}

	async sendRaw(
		type: SlackWebhookURL,
		raw: string | IncomingWebhookSendArguments,
	) {
		console.log(type)
		console.log(raw)
		return
	}

	makeKakaoTemplateWebhook(input: {
		plusFriendId: string
		receiverPhone: string
		content: string
	}): IncomingWebhookSendArguments {
		const { plusFriendId, receiverPhone, content } = input
		return {
			blocks: [
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: `실제 발송 시 [${plusFriendId}] 계정을 통해 [${receiverPhone}]으로 알림톡이 전송됩니다.`,
					},
				},
				{
					type: 'divider',
				},
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: `\`\`\`
${content}
\`\`\``,
					},
				},
			],
		}
	}
}
