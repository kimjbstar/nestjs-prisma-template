import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiNormalResponse } from "@src/common/decorators/api-normal-response";
import {
  SlackService,
  SlackWebhookURL,
} from "@src/modules/slack/slack.service";

@Controller("slack")
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post()
  @ApiNormalResponse({
    description: "슬랙 프론트용 피드백을 전송합니다.",
  })
  async send(@Body() body: any) {
    return this.slackService.sendRaw(SlackWebhookURL.KIMJBSTAR, body);
  }
}
