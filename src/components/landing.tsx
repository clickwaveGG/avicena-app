"use client";

import {
  ArrowRight,
  BookOpenText,
  Check,
  Quote,
  Stethoscope,
} from "lucide-react";
import { GoogleLoginButton } from "@/components/google-login-button";
import {
  AvicenaMark,
  CodexCover,
  Citation,
  UserBubble,
  HipBubble,
  SlashPalette,
} from "@/components/avicena";

export function Landing() {
  return (
    <div
      className="av av-scroll"
      style={{ minHeight: "100vh", background: "var(--bg)", position: "relative", overflowX: "hidden" }}
    >
      <div className="av-aurora" />

      {/* Nav */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 28px",
          borderBottom: "1px solid rgba(217, 208, 188, 0.5)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AvicenaMark size={30} />
          <div className="serif" style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Avicena
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 14,
            color: "var(--ink-muted)",
          }}
        >
          <a className="av-hide-mobile" style={{ cursor: "pointer" }}>Como funciona</a>
          <a className="av-hide-mobile" style={{ cursor: "pointer" }}>Juramento</a>
          <a className="av-hide-mobile" style={{ cursor: "pointer" }}>Manifesto</a>
          <GoogleLoginButton className="av-btn-primary">
            Começar grátis
            <ArrowRight size={16} />
          </GoogleLoginButton>
        </div>
      </div>

      {/* Hero */}
      <div className="av-hero-grid" style={{ position: "relative", zIndex: 2 }}>
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 12px",
              borderRadius: 20,
              background: "var(--bg-elev-1)",
              border: "1px solid var(--border)",
              fontSize: 12,
              color: "var(--ink-muted)",
              marginBottom: 20,
            }}
          >
            <span
              className="av-glow"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--brand-soft)",
                display: "inline-block",
              }}
            />
            Beta · feito por estudante de saúde, pra estudante de saúde
          </div>
          <h1
            className="serif"
            style={{
              fontSize: "clamp(36px, 5.5vw, 64px)",
              lineHeight: 1.04,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
            }}
          >
            O conhecimento
            <br />
            <span style={{ fontStyle: "italic", color: "var(--brand)" }}>que cura.</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(15px, 1.6vw, 19px)",
              lineHeight: 1.55,
              color: "var(--ink-muted)",
              marginTop: 24,
              maxWidth: 540,
            }}
          >
            Sobe o Robbins, o Porto, o Goodman. Pergunta pro{" "}
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>Hipócrates</span> e
            recebe parecer com a página exata citada. Estuda ouvindo, não lendo passivo às 23h47.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <GoogleLoginButton className="av-btn-primary">
              <Stethoscope size={16} />
              Começar grátis
            </GoogleLoginButton>
            <button type="button" className="av-btn-ghost">Ver o consultório por dentro</button>
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 12.5,
              color: "var(--ink-faint)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Check size={13} /> 50 anamneses/dia grátis
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Check size={13} /> Sem cartão
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Check size={13} /> Cancela em 1 clique
            </span>
          </div>
        </div>

        {/* Hero mock — mini chat preview */}
        <div style={{ position: "relative" }} className="hero-mock-wrap">
          <div
            style={{
              background: "var(--bg-elev-1)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: 20,
              boxShadow: "var(--av-shadow-lg)",
              transform: "rotate(0.5deg)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingBottom: 12,
                marginBottom: 12,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <CodexCover title="Porto Semiologia" category="Cardio" size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="serif" style={{ fontSize: 16, fontWeight: 600 }}>
                  Porto · Semiologia Médica
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>
                  1.247 páginas · 8ª edição
                </div>
              </div>
            </div>
            <UserBubble>resume fisiopato de IC esquerda</UserBubble>
            <HipBubble streaming footer={false}>
              Insuficiência cardíaca esquerda <Citation page={437} /> resulta da falência
              do VE em sustentar débito. Os mecanismos compensatórios — RAAS e simpático{" "}
              <Citation page={438} /> — preservam perfusão a curto prazo
            </HipBubble>
          </div>
          <div
            className="av-hide-mobile"
            style={{
              position: "absolute",
              bottom: -28,
              left: -36,
              transform: "rotate(-2deg)",
              pointerEvents: "none",
            }}
          >
            <SlashPalette compact activeIndex={2} />
          </div>
        </div>
      </div>

      {/* Three-up */}
      <div className="av-three-up" style={{ position: "relative", zIndex: 2 }}>
        {[
          {
            ic: BookOpenText,
            t: "Sobe o códice",
            d: "PDF do livro, atlas, diretriz, artigo. Avicena lê e indexa em 60s.",
          },
          {
            ic: Stethoscope,
            t: "Ausculta",
            d: "/resumir, /quizar, /caso, /dose, /diferenciar. Pergunta como pergunta pra amiga de turma.",
          },
          {
            ic: Quote,
            t: "Confia na citação",
            d: "Cada parecer vem com [pp. 437] clicável. Abre no PDF, vê o trecho original.",
          },
        ].map((s, i) => {
          const I = s.ic;
          return (
            <div key={i}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--brand-soft-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--brand)",
                  marginBottom: 14,
                }}
              >
                <I size={20} />
              </div>
              <div className="serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>
                {s.t}
              </div>
              <div style={{ fontSize: 14.5, color: "var(--ink-muted)", lineHeight: 1.55 }}>
                {s.d}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "32px 28px 48px",
          borderTop: "1px solid var(--border)",
          fontSize: 12,
          color: "var(--ink-faint)",
          textAlign: "center",
          fontStyle: "italic",
          lineHeight: 1.6,
        }}
      >
        Avicena é ferramenta de estudo. Não diagnostica, não prescreve, não substitui avaliação clínica presencial.
      </div>

    </div>
  );
}
