-- ============================================================================
-- Avicena · migration · 2026-05-10
-- Adiciona campos de onboarding (curso, período, turma, academia, pronomes)
-- + flag onboarded_at pra gate no page.tsx
--
-- Rodar no Supabase Dashboard → SQL editor → Run
-- Idempotente — pode rodar quantas vezes quiser
-- ============================================================================

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS course        text,
  ADD COLUMN IF NOT EXISTS period        text,
  ADD COLUMN IF NOT EXISTS cohort        text,
  ADD COLUMN IF NOT EXISTS academy       text,
  ADD COLUMN IF NOT EXISTS pronouns      text,
  ADD COLUMN IF NOT EXISTS onboarded_at  timestamptz;

-- index pra acelerar gate-check do page.tsx
CREATE INDEX IF NOT EXISTS user_profiles_onboarded_idx
  ON public.user_profiles (onboarded_at)
  WHERE onboarded_at IS NOT NULL;

-- (opcional) helper SQL
CREATE OR REPLACE FUNCTION public.is_fully_onboarded(p public.user_profiles)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT p.onboarded_at IS NOT NULL
    AND p.display_name IS NOT NULL
    AND p.course        IS NOT NULL
    AND p.period        IS NOT NULL;
$$;

-- conferir colunas
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_schema='public' AND table_name='user_profiles' ORDER BY ordinal_position;
