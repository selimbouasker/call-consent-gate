import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { ANTHROPIC_API_KEY } from '../constants';

const ConsentClassificationSchema = z.object({
  classification: z.enum(['yes', 'no', 'unclear']),
});

export type ConsentClassification = z.infer<typeof ConsentClassificationSchema>['classification'];

@Injectable()
export class ConsentAiService {
  private readonly client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  async classifyConsentReply(reply: string): Promise<ConsentClassification> {
    const message = await this.client.messages.parse({
      model: 'claude-haiku-4-5',
      max_tokens: 256,
      system:
        "You classify a candidate's spoken reply to a call-recording consent question. " +
        'Decide whether the reply means they consent (yes), they decline (no), or the reply is ' +
        'ambiguous (unclear). Judge the plain meaning of the reply, not its exact wording.',
      messages: [{ role: 'user', content: reply }],
      output_config: { format: zodOutputFormat(ConsentClassificationSchema) },
    });

    return message.parsed_output?.classification ?? 'unclear';
  }
}
