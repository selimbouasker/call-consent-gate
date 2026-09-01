import { Module } from '@nestjs/common';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { ConsentAiService } from './consent-ai.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CallsController],
  providers: [CallsService, ConsentAiService, PrismaService],
})
export class CallsModule {}
