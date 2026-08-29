import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsentAiService } from './consent-ai.service';
import { matchConsentPhrase } from './consent-match';
import { Transcript, GateOutcome } from './calls.entity';
import { ConsentRule } from '../state-rules/state-rules.service';

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
    @InjectRepository(Transcript) private readonly transcripts: Repository<Transcript>,
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

  createTranscript(input: CreateTranscriptInput): Promise<Transcript> {
    const transcript = this.transcripts.create({
      ...input,
      disclosureSaid: null,
      consentGiven: null,
      compliant: null,
      shouldBeDeleted: null,
    });
    return this.transcripts.save(transcript);
  }
}
