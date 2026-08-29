import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ConsentRule } from '../state-rules/state-rules.service';

export enum GateOutcome {
  Recorded = 'recorded',
  NotRecorded = 'not-recorded',
  BugRecordedUnconfirmed = 'bug-recorded-unconfirmed',
}

@Entity('transcripts')
export class Transcript {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'candidate_state' })
  candidateState!: string;

  @Column({ name: 'consent_rule', type: 'enum', enum: ConsentRule })
  consentRule!: ConsentRule;

  @Column({ name: 'gate_outcome', type: 'enum', enum: GateOutcome })
  gateOutcome!: GateOutcome;

  @Column({ name: 'disclosure_said', type: 'boolean', nullable: true })
  disclosureSaid!: boolean | null;

  @Column({ name: 'consent_given', type: 'boolean', nullable: true })
  consentGiven!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  compliant!: boolean | null;

  @Column({ name: 'should_be_deleted', type: 'boolean', nullable: true })
  shouldBeDeleted!: boolean | null;

  @Column({ name: 'transcript_text', type: 'text' })
  transcriptText!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
