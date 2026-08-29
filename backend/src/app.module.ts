import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { StateRulesModule } from './state-rules/state-rules.module';
import { CallsModule } from './calls/calls.module';
import { DATABASE_URL, IS_DEVELOPMENT } from './constants';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: DATABASE_URL,
      autoLoadEntities: true,
      synchronize: IS_DEVELOPMENT,
    }),
    StateRulesModule,
    CallsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
