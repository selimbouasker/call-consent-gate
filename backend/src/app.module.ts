import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { StateRulesModule } from './state-rules/state-rules.module';
import { CallsModule } from './calls/calls.module';
import { AuthModule } from './auth/auth.module';
import { appConstants, isDevelopment } from './constants';

@Module({
  imports: [
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
})
export class AppModule {}
