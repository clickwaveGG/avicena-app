import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Avicena. O conhecimento que cura.",
  description:
    "Consultório do estudante de saúde. Sobe teu códice (PDF) e consulta o Hipócrates com citação de página exata.",
  icons: {
    icon: "/avicena-logo.png",
    apple: "/avicena-logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-50 border-b border-rule bg-white/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/avicena-logo.png"
                alt="Avicena"
                width={44}
                height={44}
                priority
                className="h-11 w-11 object-contain [image-rendering:pixelated]"
              />
              <span
                className="text-2xl font-bold tracking-tight text-ink"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Avicena
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <nav className="hidden text-sm font-medium text-ink-soft md:flex md:gap-6">
                <Link href="/consultorio" className="hover:text-ink">
                  Consultório
                </Link>
                <Link href="/planos" className="hover:text-ink">
                  Planos
                </Link>
              </nav>

              {user ? (
                <div className="flex items-center gap-3">
                  <span
                    className="hidden text-xs text-ink-soft sm:inline"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {user.email}
                  </span>
                  <form action="/auth/sign-out" method="post">
                    <button
                      type="submit"
                      className="rounded-md border border-rule bg-white px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-clinic-500 hover:text-clinic-700"
                    >
                      Sair
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md bg-clinic-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-clinic-600"
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col">{children}</main>

        <footer className="border-t border-rule-soft bg-white">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <p className="text-xs italic text-ink-mute">
              Material de estudo. Não substitui avaliação clínica presencial.
              Os pareceres são exclusivamente educativos, baseados nos PDFs que
              você forneceu.
            </p>
            <p className="mt-2 text-xs text-ink-mute">
              Avicena · O conhecimento que cura.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
