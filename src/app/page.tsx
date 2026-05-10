import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

  const { data: profile } = await supabase
    .from("user_profiles")
    .select(
      "display_name, tier, course, period, cohort, academy, pronouns, onboarded_at"
    )
    .eq("id", user.id)
    .single();

  // Gate: precisa preencher o juramento antes de entrar no consultório
  if (!profile?.onboarded_at) {
    redirect("/bem-vindo");
  }

  return <Dashboard email={user.email ?? ""} profile={profile} />;
}
