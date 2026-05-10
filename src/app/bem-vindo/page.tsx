import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureOnboardingSchema } from "@/lib/ensure-schema";
import { OnboardingWizard } from "@/components/onboarding-wizard";

export default async function BemVindoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Garante que as colunas de onboarding existem antes do wizard tentar UPDATE
  await ensureOnboardingSchema();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Se já completou onboarding, manda pro consultório
  if (profile?.onboarded_at) {
    redirect("/");
  }

  const defaultName =
    (profile?.display_name as string | null)?.trim() ||
    user.email?.split("@")[0] ||
    "";

  return <OnboardingWizard defaultDisplayName={defaultName} />;
}
