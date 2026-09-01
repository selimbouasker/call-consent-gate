-- CreateTable
CREATE TABLE "transcripts" (
    "id" TEXT NOT NULL,
    "candidate_state" TEXT NOT NULL,
    "consent_rule" TEXT NOT NULL,
    "gate_outcome" TEXT NOT NULL,
    "disclosure_said" BOOLEAN,
    "consent_given" BOOLEAN,
    "compliant" BOOLEAN,
    "should_be_deleted" BOOLEAN,
    "transcript_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transcripts_pkey" PRIMARY KEY ("id")
);
