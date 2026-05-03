import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInWithGoogle } from "./actions";

export const metadata = {
  title: "Entrar — Avicena",
};

type LoginPageProps = {
  searchParams: Promise<{ erro?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/consultorio");
  }

  const { erro } = await searchParams;

  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full rounded-2xl border border-rule bg-white px-8 py-10 shadow-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/avicena-logo.png"
            alt="Avicena"
            width={56}
            height={56}
            priority
            className="mb-4 h-14 w-14 object-contain [image-rendering:pixelated]"
          />
          <h1
            className="text-3xl font-bold tracking-tight text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Avicena
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Faz teu juramento e entra no consultório.
          </p>
        </div>

        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-rule bg-white px-4 py-3 text-sm font-medium text-ink transition hover:border-clinic-500 hover:bg-clinic-50"
          >
            <GoogleIcon />
            Entrar com Google
          </button>
        </form>

        {erro && (
          <p className="mt-6 rounded-md border border-amber-500/40 bg-amber-500/5 px-3 py-2 text-xs text-amber-700">
            Não foi possível entrar: {erro}
          </p>
        )}

        <p className="mt-8 text-center text-xs italic text-ink-soft">
          Material de estudo. Não substitui avaliação clínica presencial.
        </p>

        <p className="mt-4 text-center text-xs text-ink-soft">
          <Link href="/" className="hover:text-ink">
            ← voltar ao início
          </Link>
        </p>
      </div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.9c1.7-1.57 2.69-3.88 2.69-6.61z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.99-2.34z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.96L3.95 7.3C4.66 5.17 6.65 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
