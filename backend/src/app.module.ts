import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthController } from './health.controller';
import { StateRulesModule } from './state-rules/state-rules.module';
import { CallsModule } from './calls/calls.module';
import { AuthModule } from './auth/auth.module';
import { appConstants, isDevelopment } from './constants';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: appConstants.databaseUrl,
      autoLoadEntities: true,
      synchronize: isDevelopment,
    }),
    AuthModule,
    StateRulesModule,
    CallsModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
