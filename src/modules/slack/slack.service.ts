import { Global, Injectable } from "@nestjs/common";
import { IncomingWebhook, IncomingWebhookSendArguments } from "@slack/webhook";

/** 각 채널별 WebHook 관리용 객체 */
export enum SlackWebhookURL {
  /** 개발_popbill */
  KAKAO = "https://hooks.slack.com/services/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",
  /** 개발_log */
  LOG = "https://hooks.slack.com/services/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",
  /** 개발_시스템_피드백 */
  FEEDBACK = `https://hooks.slack.com/services/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`,
  /** 개발_서비스_피드백 */
  FRONT_FEEDBACK = `https://hooks.slack.com/services/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`,
  /** 로지파스타_캐시 */
  CASH = "https://hooks.slack.com/services/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",
  /** 공지사항 */
  NOTICE = "https://hooks.slack.com/services/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",
  /** 김종범(개인메세지) */
  KIMJBSTAR = "https://hooks.slack.com/services/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",
  /** 테스트 */
  TEST = "https://hooks.slack.com/services/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",
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
    raw: string | IncomingWebhookSendArguments,
  ) {
    const webhook = SlackService.getWebhook(type);
    return webhook.send(raw);
  }
}
