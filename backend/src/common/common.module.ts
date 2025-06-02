import { Global, Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';

@Global()
@Module({
  providers: [
    {
      provide: LoggerService,
      useFactory: () => {
        return new LoggerService('NestApplication');
      },
    },
  ],
  exports: [LoggerService],
})
export class CommonModule {}
