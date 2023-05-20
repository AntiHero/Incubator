import {
  Module,
  Provider,
  DynamicModule,
  FactoryProvider,
} from '@nestjs/common';

import { TelegramOptions, TelegramProvider } from './telegram.provider';

@Module({})
export class TelegramModule {
  public static forRootAsync({
    useFactory,
    inject,
  }: Omit<FactoryProvider<TelegramOptions>, 'provide'>): DynamicModule {
    const options: Provider = {
      provide: TelegramOptions,
      useFactory,
      inject,
    };

    const telegramProvider: Provider = {
      provide: TelegramProvider,
      useFactory: (telegramOptions: TelegramOptions) =>
        new TelegramProvider(telegramOptions),
      inject: [TelegramOptions],
    };

    return {
      module: TelegramModule,
      providers: [telegramProvider, options],
      exports: [TelegramProvider],
    };
  }
}
