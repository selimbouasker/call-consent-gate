import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { ConsentAiService } from './consent-ai.service';
import { Transcript } from './calls.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transcript])],
  controllers: [CallsController],
  providers: [CallsService, ConsentAiService],
})
export class CallsModule {}
