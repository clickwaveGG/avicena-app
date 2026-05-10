import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureOnboardingSchema } from "@/lib/ensure-schema";
import { Landing } from "@/components/landing";
import { Dashboard } from "@/components/dashboard";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Landing />;
  }

  // Garante que as colunas de onboarding existem (idempotente, cacheado por instance)
  await ensureOnboardingSchema();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Gate: precisa preencher o juramento antes de entrar no consultório
  if (!profile?.onboarded_at) {
    redirect("/bem-vindo");
  }

  return <Dashboard email={user.email ?? ""} profile={profile} />;
}
