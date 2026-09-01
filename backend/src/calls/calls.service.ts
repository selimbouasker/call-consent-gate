import { Injectable } from '@nestjs/common';
import type { Transcript } from '@prisma/client';
import { ConsentAiService } from './consent-ai.service';
import { matchConsentPhrase } from './consent-match';
import { PrismaService } from '../prisma/prisma.service';
import { ConsentRule } from '../state-rules/state-rules.service';

export enum GateOutcome {
  Recorded = 'recorded',
  NotRecorded = 'not-recorded',
  BugRecordedUnconfirmed = 'bug-recorded-unconfirmed',
}

export interface ConsentClassificationResult {
  classification: 'yes' | 'no' | 'unclear';
  shouldRetry: boolean;
}

export interface CreateTranscriptInput {
  candidateState: string;
  consentRule: ConsentRule;
  gateOutcome: GateOutcome;
  transcriptText: string;
}

@Injectable()
export class CallsService {
  constructor(
    private readonly consentAi: ConsentAiService,
    private readonly prisma: PrismaService,
  ) {}

  async resolveConsentReply(reply: string, isRetry: boolean): Promise<ConsentClassificationResult> {
    const localMatch = matchConsentPhrase(reply);
    if (localMatch) {
      return { classification: localMatch, shouldRetry: false };
    }

    const classification = await this.consentAi.classifyConsentReply(reply);
    if (classification !== 'unclear') {
      return { classification, shouldRetry: false };
    }

    return { classification: 'unclear', shouldRetry: !isRetry };
  }

  async createTranscript(input: CreateTranscriptInput): Promise<Transcript> {
    const { disclosureSaid, consentGiven } = await this.consentAi.auditCall(
      input.transcriptText,
      input.consentRule,
    );

    // A call that was never recorded carries no compliance risk, regardless of what was
    // said — there's nothing to purge. Only a recorded call can be non-compliant.
    const wasRecorded = input.gateOutcome !== GateOutcome.NotRecorded;
    const compliant = !wasRecorded || (disclosureSaid && consentGiven);
    const shouldBeDeleted = wasRecorded && !compliant;

    return this.prisma.transcript.create({
      data: {
        ...input,
        disclosureSaid,
        consentGiven,
        compliant,
        shouldBeDeleted,
      },
    });
  }

  listTranscripts(): Promise<Transcript[]> {
    return this.prisma.transcript.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
