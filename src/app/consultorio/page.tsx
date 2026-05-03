import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Consultório — Avicena",
};

export default async function ConsultorioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/consultorio");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name, tier")
    .eq("id", user.id)
    .single();

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-wider text-ink-mute">
          Consultório
        </p>
        <h1
          className="mt-1 text-3xl font-bold tracking-tight text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Bem-vindo,{" "}
          <span className="italic text-clinic-500">
            {profile?.display_name ?? user.email?.split("@")[0]}
          </span>
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Plano atual:{" "}
          <span
            className="rounded bg-clinic-50 px-2 py-0.5 text-clinic-700"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {profile?.tier ?? "estagiario"}
          </span>
        </p>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-rule bg-white px-8 py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-clinic-50 text-2xl text-clinic-700">
          📜
        </div>
        <h2
          className="text-xl font-semibold text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Sem códices ainda
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
          Sobe teu primeiro PDF e o Hipócrates já vai poder consultar.
          Upload chega no Sprint 1.3.
        </p>
        <button
          disabled
          className="mt-6 cursor-not-allowed rounded-md bg-ink/10 px-4 py-2 text-sm font-medium text-ink-soft"
        >
          Subir códice (em breve)
        </button>
      </div>
    </section>
  );
}
