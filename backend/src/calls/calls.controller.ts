import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CallsService, GateOutcome } from './calls.service';
import { ConsentRule } from '../state-rules/state-rules.service';
import { AppPasswordGuard } from '../auth/app-password.guard';

interface ClassifyConsentBody {
  reply: string;
  isRetry: boolean;
}

interface CreateCallBody {
  candidateState: string;
  consentRule: ConsentRule;
  gateOutcome: GateOutcome;
  transcriptText: string;
}

@UseGuards(AppPasswordGuard)
@Controller()
export class CallsController {
  constructor(private readonly calls: CallsService) {}

  @Post('consent/classify')
  classify(@Body() body: ClassifyConsentBody) {
    return this.calls.resolveConsentReply(body.reply, body.isRetry);
  }

  @Post('calls')
  create(@Body() body: CreateCallBody) {
    return this.calls.createTranscript(body);
  }

  @Get('calls')
  list() {
    return this.calls.listTranscripts();
  }
}
