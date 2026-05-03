import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-clinic-100 bg-clinic-50 px-3 py-1 text-xs font-medium text-clinic-700">
        Sprint 1.1 · auth Google ativa
      </span>

      <h1
        className="mb-5 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Consultório do{" "}
        <span className="italic text-clinic-500">Avicena</span>
      </h1>

      <p className="mb-10 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
        Aqui é onde teu códice vira parecer. Sobe um PDF, faz a anamnese
        e o Hipócrates ausculta — com citação de página exata.
      </p>

      {user ? (
        <Link
          href="/consultorio"
          className="rounded-lg bg-clinic-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-clinic-600"
        >
          Ir pro consultório →
        </Link>
      ) : (
        <Link
          href="/login"
          className="rounded-lg bg-clinic-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-clinic-600"
        >
          Fazer o juramento (entrar com Google)
        </Link>
      )}

      <p
        className="mt-8 text-xs text-ink-mute"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {user ? `✓ logado como ${user.email}` : "○ sem sessão"}
      </p>
    </section>
  );
}
