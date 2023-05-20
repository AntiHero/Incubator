import { Injectable, OnModuleInit } from '@nestjs/common';

export class TelegramOptions {
  public readonly apiKey: string;

  public readonly url: string;
}

@Injectable()
export class TelegramProvider implements OnModuleInit {
  private readonly setWebhookEndpoint: string;

  public constructor(protected readonly options: TelegramOptions) {
    const { apiKey } = options;

    this.setWebhookEndpoint = `https://api.telegram.org/bot${apiKey}/setWebhook`;
  }

  public async onModuleInit() {
    const { url } = this.options;

    const telegramEndpoint = new URL(this.setWebhookEndpoint);

    const request = new Request(telegramEndpoint, {
      headers: [['Content-type', 'application/json']],
      method: 'POST',
      body: JSON.stringify({
        url,
      }),
    });

    await fetch(request)
      .then((res) => res.json())
      .catch((e) => {
        console.log(e, '\n', 'Can not set webhook');
      });
  }
}
