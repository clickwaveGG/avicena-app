import postgres from "postgres";

/**
 * Aplica idempotentemente a migration do onboarding no Supabase.
 * Cacheada em memória pra não rodar a cada request (por instance Vercel).
 * Self-healing — se as colunas já existem, ALTER TABLE IF NOT EXISTS no-op.
 */

let applied = false;
let inFlight: Promise<void> | null = null;

const MIGRATION_SQL = `
  ALTER TABLE public.user_profiles
    ADD COLUMN IF NOT EXISTS course        text,
    ADD COLUMN IF NOT EXISTS period        text,
    ADD COLUMN IF NOT EXISTS cohort        text,
    ADD COLUMN IF NOT EXISTS academy       text,
    ADD COLUMN IF NOT EXISTS pronouns      text,
    ADD COLUMN IF NOT EXISTS onboarded_at  timestamptz;

  CREATE INDEX IF NOT EXISTS user_profiles_onboarded_idx
    ON public.user_profiles (onboarded_at)
    WHERE onboarded_at IS NOT NULL;
`;

export async function ensureOnboardingSchema(): Promise<void> {
  if (applied) return;
  if (inFlight) return inFlight;

  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[ensure-schema] DATABASE_URL ausente — pulando migration");
    applied = true;
    return;
  }

  inFlight = (async () => {
    const sql = postgres(url, {
      max: 1,
      idle_timeout: 5,
      connect_timeout: 10,
      prepare: false,
    });
    try {
      await sql.unsafe(MIGRATION_SQL);
      applied = true;
      console.log("[ensure-schema] onboarding columns OK");
    } catch (err) {
      console.error("[ensure-schema] falhou:", err);
      // Não throw — degradação graciosa. Próxima request tenta de novo.
    } finally {
      await sql.end({ timeout: 5 });
      inFlight = null;
    }
  })();

  return inFlight;
}
