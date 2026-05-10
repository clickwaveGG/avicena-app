"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureOnboardingSchema } from "@/lib/ensure-schema";

export type OnboardingPayload = {
  displayName: string;
  course: string;
  period: string;
  cohort: string;
};

export type OnboardingResult =
  | { ok: true }
  | { ok: false; error: string };

const COURSE_VALUES = new Set([
  "medicina",
  "enfermagem",
  "fisioterapia",
  "farmacia",
  "odontologia",
  "nutricao",
  "biomedicina",
  "outro",
]);

export async function completeOnboarding(
  payload: OnboardingPayload
): Promise<OnboardingResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Sessão expirou. Faz login de novo." };
  }

  // Garante que as colunas existem antes do UPDATE
  await ensureOnboardingSchema();

  const displayName = payload.displayName.trim();
  const course = payload.course.trim().toLowerCase();
  const period = payload.period.trim();
  const cohort = payload.cohort.trim();

  if (displayName.length < 2) {
    return { ok: false, error: "Nome muito curto." };
  }
  if (!COURSE_VALUES.has(course)) {
    return { ok: false, error: "Curso inválido." };
  }
  if (!period) {
    return { ok: false, error: "Diz o período em que tu tá." };
  }
  if (!cohort) {
    return { ok: false, error: "Falta a turma." };
  }

  const { error } = await supabase
    .from("user_profiles")
    .update({
      display_name: displayName,
      course,
      period,
      cohort,
      onboarded_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function redirectToConsultorio() {
  redirect("/");
}
