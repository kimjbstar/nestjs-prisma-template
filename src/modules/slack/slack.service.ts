import { Global, Injectable } from "@nestjs/common";
import { IncomingWebhook, IncomingWebhookSendArguments } from "@slack/webhook";

/** 각 채널별 WebHook 관리용 객체 */
export enum SlackWebhookURL {
  /** 김종범(개인메세지) */
  KIMJBSTAR = "https://hooks.slack.com/services/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",
}

@Injectable()
export class SlackService {
  static webhookRecord: Partial<Record<SlackWebhookURL, IncomingWebhook>> = {};
  static getWebhook(type: SlackWebhookURL) {
    return (
      this.webhookRecord[type] ||
      (this.webhookRecord[type] = new IncomingWebhook(type))
    );
  }
  async sendText(type: SlackWebhookURL, text: string) {
    const webhook = SlackService.getWebhook(type);
    return webhook.send(text);
  }

  async sendRaw(
    type: SlackWebhookURL,
    raw: string | IncomingWebhookSendArguments
  ) {
    const webhook = SlackService.getWebhook(type);
    return webhook.send(raw);
  }
}
