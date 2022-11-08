import { Module } from '@nestjs/common';
import { TestingModule } from './testing/testing.module';

@Module({
  imports: [TestingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
