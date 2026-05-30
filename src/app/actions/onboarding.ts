"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type OnboardingPayload = {
  displayName: string;
  course: string;
  period: string;
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

  const displayName = payload.displayName.trim();
  const course = payload.course.trim().toLowerCase();
  const period = payload.period.trim();

  if (displayName.length < 2) {
    return { ok: false, error: "Nome muito curto." };
  }
  if (!COURSE_VALUES.has(course)) {
    return { ok: false, error: "Curso inválido." };
  }
  if (!period) {
    return { ok: false, error: "Diz o período em que tu tá." };
  }

  const { error } = await supabase
    .from("user_profiles")
    .update({
      display_name: displayName,
      course,
      period,
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
