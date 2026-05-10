"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Calendar,
  ClipboardCheck,
  Flame,
  GraduationCap,
  Menu,
  MessageSquare,
  Search,
  Stethoscope,
  TrendingUp,
  Users,
  UserSearch,
  Repeat2,
  Award,
  Bell,
  ChevronRight,
  X,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { AvicenaMark, CodexCover } from "@/components/avicena";

type Profile = {
  display_name: string | null;
  tier: string | null;
  course?: string | null;
  period?: string | null;
  cohort?: string | null;
  academy?: string | null;
  pronouns?: string | null;
  onboarded_at?: string | null;
};

const COURSE_LABELS: Record<string, string> = {
  medicina: "Medicina",
  enfermagem: "Enfermagem",
  fisioterapia: "Fisioterapia",
  farmacia: "Farmácia",
  odontologia: "Odontologia",
  nutricao: "Nutrição",
  biomedicina: "Biomedicina",
  outro: "Outro",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "boa madrugada";
  if (h < 12) return "bom dia";
  if (h < 18) return "boa tarde";
  return "boa noite";
}

type NavItem = {
  id: string;
  label: string;
  icon: typeof Stethoscope;
  href: string;
  active?: boolean;
  badge?: number;
  soon?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Consultório", icon: Stethoscope, href: "/", active: true },
  { id: "anamnese", label: "Anamneses", icon: MessageSquare, href: "/anamnese" },
  { id: "codices", label: "Códices", icon: BookOpenText, href: "/anamnese" },
  { id: "sabatinas", label: "Sabatinas", icon: ClipboardCheck, href: "#", badge: 2 },
  { id: "roteiro", label: "Roteiro", icon: Calendar, href: "#", soon: true },
  { id: "revisao", label: "Revisão", icon: Repeat2, href: "#", soon: true },
  { id: "casos", label: "Casos", icon: UserSearch, href: "#", soon: true },
  { id: "turma", label: "Turma", icon: Users, href: "#", soon: true },
  { id: "carreira", label: "Carreira", icon: Award, href: "#", soon: true },
];

const STATS = [
  {
    label: "Top 1% em Cardio",
    value: "Top 1%",
    sub: "que mais estudaram nos últimos 30 dias",
    accent: true,
    icon: TrendingUp,
  },
  {
    label: "Anamneses esta semana",
    value: "47",
    sub: "média da turma: 23",
    delta: "+104%",
    icon: MessageSquare,
  },
  {
    label: "Sequência",
    value: "12 dias",
    sub: "não solta — recorde da turma",
    icon: Flame,
  },
  {
    label: "Cobertura Patologia",
    value: "63%",
    sub: "do material da Profª Camila",
    icon: BookOpenText,
  },
];

const TOOLS = [
  {
    id: "anamnese",
    title: "Anamneses com Hipócrates",
    desc: "Chat IA com citação clicável da página exata. /resumir, /quizar, /caso, /dose.",
    icon: MessageSquare,
    href: "/anamnese",
    status: "ATIVO",
    state: "active" as const,
  },
  {
    id: "codices",
    title: "Códices",
    desc: "Tua estante de PDFs + códices oficiais da Cátedra liberados pela Profª Camila.",
    icon: BookOpenText,
    href: "/anamnese",
    status: "ATIVO",
    state: "active" as const,
  },
  {
    id: "sabatinas",
    title: "Sabatinas da Cátedra",
    desc: "Avaliações criadas pela Profª. Vence amanhã 23:59 — Necrose celular.",
    icon: ClipboardCheck,
    href: "#",
    status: "1 PENDENTE",
    state: "urgent" as const,
  },
  {
    id: "roteiro",
    title: "Roteiro Clínico",
    desc: "Trilha sequencial montada pela Profª. Tu tá em 3/8 da etapa atual.",
    icon: Calendar,
    href: "#",
    status: "EM BREVE",
    state: "soon" as const,
  },
  {
    id: "revisao",
    title: "Revisão SRS",
    desc: "Flashcards com repetição espaçada gerados das anamneses. Reter sem reler.",
    icon: Repeat2,
    href: "#",
    status: "EM BREVE",
    state: "soon" as const,
  },
  {
    id: "casos",
    title: "Banco de Casos",
    desc: "Casos clínicos validados pela Cátedra. Raciocínio diagnóstico encadeado.",
    icon: UserSearch,
    href: "#",
    status: "EM BREVE",
    state: "soon" as const,
  },
  {
    id: "turma",
    title: "Tua Turma",
    desc: "Canal da Cátedra + grupos de estudo + sala virtual com Pomodoro sincronizado.",
    icon: Users,
    href: "#",
    status: "EM BREVE",
    state: "soon" as const,
  },
  {
    id: "carreira",
    title: "Carreira",
    desc: "Portfólio clínico, tracker de plantões, currículo em construção, mock interview.",
    icon: Award,
    href: "#",
    status: "EM BREVE",
    state: "soon" as const,
  },
];

const RECENT_CODICES = [
  { title: "Porto Semiologia", category: "Cardio", author: "Porto · 8ª ed", pages: 1247, last: "23:04", cathedra: true },
  { title: "Robbins Patologia", category: "Patologia", author: "Kumar · 10ª ed", pages: 1480, last: "ontem", cathedra: true },
  { title: "Goodman & Gilman", category: "Farma", author: "13ª ed", pages: 1808, last: "qua", cathedra: false },
  { title: "Tratado Cardiologia SBC", category: "Cardio", author: "SBC · 2ª ed", pages: 912, last: "4 dias", cathedra: false },
  { title: "Diretriz IC 2022", category: "Cardio", author: "AHA/SBC", pages: 124, last: "1 sem", cathedra: false },
];

const TURMA_RANKING = [
  { matter: "Cardiologia", you: 47, average: 23, top: 47, position: "1º" },
  { matter: "Patologia", you: 31, average: 19, top: 38, position: "3º" },
  { matter: "Farmacologia", you: 18, average: 12, top: 24, position: "5º" },
  { matter: "Anatomia", you: 9, average: 14, top: 22, position: "12º" },
];

export function Dashboard({
  email,
  profile,
}: {
  email: string;
  profile: Profile | null;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName =
    profile?.display_name?.trim() || email?.split("@")[0] || "estudante";
  const tier = profile?.tier ?? "estagiario";
  const initial = displayName.slice(0, 1).toUpperCase();
  const academy = profile?.academy?.trim() || "Academia";
  const courseLabel =
    COURSE_LABELS[profile?.course ?? ""] ?? "Curso";
  const cohort = profile?.cohort?.trim() || "";
  const academyLine = [academy, courseLabel, cohort]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="av" style={{ minHeight: "100vh", display: "flex" }}>
      {/* Mobile backdrop */}
      <div
        className={`av-dash-backdrop ${sidebarOpen ? "is-open" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`av-dash-sidebar ${sidebarOpen ? "is-open" : ""}`}
        style={{
          width: 260,
          flexShrink: 0,
          borderRight: "1px solid var(--border)",
          background: "var(--bg-elev-1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Brand + Academy */}
        <div
          style={{
            padding: "18px 18px 14px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <AvicenaMark size={26} />
              <span className="serif" style={{ fontSize: 18, fontWeight: 600 }}>
                Avicena
              </span>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-faint)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
              }}
            >
              {academyLine}
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              padding: 4,
              color: "var(--ink-faint)",
              display: "none",
            }}
            className="av-mobile-close"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "12px 8px 8px" }} className="av-scroll">
          {NAV_ITEMS.map((item) => {
            const I = item.icon;
            const classes = [
              "av-nav-item",
              item.active ? "is-active" : "",
              item.soon ? "is-disabled" : "",
            ]
              .filter(Boolean)
              .join(" ");

            const inner = (
              <>
                <I size={16} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge ? (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 8,
                      background: "var(--alert-bg)",
                      color: "var(--alert)",
                      flexShrink: 0,
                    }}
                  >
                    {item.badge}
                  </span>
                ) : null}
                {item.soon ? (
                  <span
                    className="mono"
                    style={{
                      fontSize: 9.5,
                      color: "var(--ink-faint)",
                      padding: "1px 5px",
                      border: "1px solid var(--border)",
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  >
                    em breve
                  </span>
                ) : null}
              </>
            );

            if (item.soon) {
              return (
                <div key={item.id} className={classes} aria-disabled="true">
                  {inner}
                </div>
              );
            }
            return (
              <Link key={item.id} href={item.href} className={classes}>
                {inner}
              </Link>
            );
          })}
        </nav>

        {/* Mestra block */}
        <div
          style={{
            padding: "12px 14px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "var(--bg-elev-2)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--accent)",
              color: "#3A2A0A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <GraduationCap size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Profª Camila Silva
            </div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-faint)" }}>
              Patologia · Cátedra
            </div>
          </div>
        </div>

        {/* User */}
        <div
          style={{
            padding: "12px 14px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--brand)",
              color: "#F4F1EA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayName}
            </div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-faint)" }}>
              {tier}
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              style={{
                fontSize: 11,
                color: "var(--ink-muted)",
                padding: "4px 8px",
                borderRadius: 6,
                border: "1px solid var(--border)",
              }}
            >
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, background: "var(--bg)", position: "relative" }}>
        {/* Aurora fixa — não causa reflow no scroll */}
        <div className="av-aurora is-static" />

        {/* Top bar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            padding: "14px 24px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="av-mobile-trigger"
            aria-label="Abrir menu"
          >
            <Menu size={18} />
          </button>

          <div className="serif" style={{ fontSize: 17, fontWeight: 600 }}>
            Consultório
          </div>

          <div
            className="av-hide-mobile"
            style={{
              flex: 1,
              maxWidth: 420,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 10,
              background: "var(--bg-elev-2)",
              fontSize: 13,
              color: "var(--ink-muted)",
              marginLeft: 8,
            }}
          >
            <Search size={14} />
            <span style={{ flex: 1 }}>Busca rápida — anamneses, códices, sabatinas</span>
            <span
              className="mono"
              style={{
                fontSize: 11,
                padding: "1px 5px",
                border: "1px solid var(--border)",
                borderRadius: 4,
                color: "var(--ink-faint)",
              }}
            >
              ⌘K
            </span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
            <button
              style={{ position: "relative", padding: 6, color: "var(--ink-muted)" }}
              aria-label="Notificações"
            >
              <Bell size={18} />
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--alert)",
                  border: "2px solid rgba(255, 255, 255, 0.85)",
                }}
              />
            </button>
            <div className="av-tabular av-hide-mobile" style={{ fontSize: 12.5, color: "var(--ink-muted)" }}>
              <span style={{ fontWeight: 600, color: "var(--ink)" }}>12</span>/50 hoje
            </div>
          </div>
        </header>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "32px 24px 64px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* Greeting */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginBottom: 4 }}>
              {getGreeting()}, {displayName}
            </div>
            <h1
              className="serif"
              style={{
                fontSize: "clamp(26px, 4vw, 38px)",
                fontWeight: 600,
                letterSpacing: "-0.015em",
                lineHeight: 1.12,
                marginBottom: 6,
              }}
            >
              Tua semana em{" "}
              <span style={{ fontStyle: "italic", color: "var(--brand)" }}>Cardio</span>
              {" "}já tá te colocando no topo.
            </h1>
            <p style={{ fontSize: 15, color: "var(--ink-muted)", lineHeight: 1.55 }}>
              Continua de onde parou no Porto, encara a Sabatina, ou bora um códice novo.
            </p>
          </div>

          {/* Stats hero */}
          <div className="av-dash-stats">
            {STATS.map((s) => {
              const I = s.icon;
              return (
                <div
                  key={s.label}
                  className={`av-stat-card ${s.accent ? "is-accent" : ""}`}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: s.accent ? "#6F5417" : "var(--ink-muted)",
                      marginBottom: 12,
                      position: "relative",
                    }}
                  >
                    <I size={13} />
                    {s.label}
                  </div>
                  <div
                    className="serif"
                    style={{
                      fontSize: s.accent ? 32 : 28,
                      fontWeight: 700,
                      lineHeight: 1,
                      color: s.accent ? "#6F5417" : "var(--ink)",
                      marginBottom: 6,
                      letterSpacing: "-0.02em",
                      position: "relative",
                    }}
                  >
                    {s.value}
                    {s.delta ? (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--brand-soft)",
                          marginLeft: 8,
                          verticalAlign: "middle",
                        }}
                      >
                        {s.delta}
                      </span>
                    ) : null}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: s.accent ? "#7A6027" : "var(--ink-muted)",
                      lineHeight: 1.45,
                      position: "relative",
                    }}
                  >
                    {s.sub}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hoje na Cátedra */}
          <SectionTitle title="Hoje na tua Cátedra" right="ver tudo →" />
          <div className="av-dash-cathedra">
            <div className="av-card is-accent" style={{ padding: 16, display: "flex", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--accent-bg)",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ClipboardCheck size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#6F5417",
                    marginBottom: 2,
                  }}
                >
                  Sabatina · vence amanhã 23:59
                </div>
                <div className="serif" style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>
                  Necrose celular
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-muted)" }}>
                  10 questões · estilo Revalida · cronometrada 25min
                </div>
              </div>
              <button className="av-btn-soft" style={{ flexShrink: 0, alignSelf: "center" }}>
                iniciar <ArrowRight size={14} />
              </button>
            </div>

            <div className="av-card" style={{ padding: 16, display: "flex", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "var(--accent)",
                  color: "#3A2A0A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <GraduationCap size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--ink-muted)",
                    marginBottom: 2,
                  }}
                >
                  Mensagem · Profª Camila
                </div>
                <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.5 }}>
                  &ldquo;Bora revisar apoptose hoje — 70% da turma furou no quiz da semana passada.&rdquo;
                </div>
              </div>
            </div>
          </div>

          {/* Continua de onde parou */}
          <SectionTitle title="Continua de onde parou" />
          <Link href="/anamnese" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
            <div className="av-card is-interactive" style={{ padding: 18, display: "flex", gap: 16, alignItems: "center" }}>
              <CodexCover title="Porto Semiologia" category="Cardio" size="sm" cathedra />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--ink-faint)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 600,
                  }}
                >
                  Última anamnese · 23:04
                </div>
                <div className="serif" style={{ fontSize: 18, fontWeight: 600, marginTop: 2, marginBottom: 6 }}>
                  Porto Semiologia
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-muted)",
                    lineHeight: 1.45,
                    fontStyle: "italic",
                  }}
                >
                  &ldquo;resume fisiopato de IC esquerda e me dá 5 questões pra prova segunda&rdquo;
                </div>
              </div>
              <div style={{ color: "var(--brand)", flexShrink: 0 }}>
                <ChevronRight size={20} />
              </div>
            </div>
          </Link>

          {/* Tools grid */}
          <SectionTitle
            title="Ferramentas da formação"
            right={
              <>
                <span style={{ color: "var(--brand-soft)", fontWeight: 600 }}>3 ativas</span>
                {" · 5 em breve"}
              </>
            }
          />
          <div className="av-dash-tools">
            {TOOLS.map((t) => {
              const I = t.icon;
              const isSoon = t.state === "soon";
              const isUrgent = t.state === "urgent";

              const cardClass = [
                "av-card",
                isSoon ? "is-disabled" : "is-interactive",
                isUrgent ? "is-accent" : "",
              ]
                .filter(Boolean)
                .join(" ");

              const inner = (
                <div className={cardClass} style={{ padding: 18, height: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: isUrgent ? "var(--accent-bg)" : "var(--brand-soft-bg)",
                        color: isUrgent ? "#6F5417" : "var(--brand)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <I size={18} />
                    </div>
                    <span
                      className="mono"
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        padding: "3px 8px",
                        borderRadius: 6,
                        background:
                          t.state === "active"
                            ? "var(--brand-soft-bg)"
                            : isUrgent
                            ? "var(--accent-bg)"
                            : "var(--bg-elev-2)",
                        color:
                          t.state === "active"
                            ? "var(--brand)"
                            : isUrgent
                            ? "#6F5417"
                            : "var(--ink-faint)",
                      }}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="serif" style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-muted)", lineHeight: 1.5 }}>
                    {t.desc}
                  </div>
                </div>
              );

              if (isSoon || t.href === "#") {
                return <div key={t.id}>{inner}</div>;
              }
              return (
                <Link key={t.id} href={t.href} style={{ textDecoration: "none", color: "inherit" }}>
                  {inner}
                </Link>
              );
            })}
          </div>

          {/* Tua estante */}
          <SectionTitle
            title={`Tua estante · ${RECENT_CODICES.length} códices`}
            right={
              <>
                <span style={{ color: "var(--accent)" }}>2</span> da Cátedra · 3 pessoais
              </>
            }
          />
          <div className="av-dash-codices">
            {RECENT_CODICES.map((c) => (
              <div key={c.title} className="av-codex-card">
                <CodexCover
                  title={c.title}
                  category={c.category}
                  author={c.author}
                  size="md"
                  cathedra={c.cathedra}
                />
                <div style={{ paddingTop: 10 }}>
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: "var(--ink-faint)",
                      marginTop: 2,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{c.pages}p</span>
                    <span>{c.last}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparativo turma */}
          <SectionTitle
            title="Posição na turma · últimos 30 dias"
            right="80 estagiários na M3-2026.1"
          />
          <div className="av-card" style={{ padding: 22 }}>
            {TURMA_RANKING.map((r, i) => {
              const pct = Math.min(100, (r.you / r.top) * 100);
              const isLeader = r.position === "1º";
              const isLast = i === TURMA_RANKING.length - 1;
              return (
                <div
                  key={r.matter}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr 80px",
                    gap: 16,
                    alignItems: "center",
                    paddingBottom: isLast ? 0 : 14,
                    marginBottom: isLast ? 0 : 14,
                    borderBottom: isLast ? "none" : "1px solid var(--bg-elev-2)",
                  }}
                  className="av-rank-row"
                >
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.matter}</div>
                    <div className="mono" style={{ fontSize: 11, color: "var(--ink-faint)" }}>
                      {r.you} anamneses
                    </div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        height: 8,
                        background: "var(--bg-elev-2)",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: isLeader
                            ? "linear-gradient(90deg, var(--accent), var(--brand-soft))"
                            : "var(--brand-soft)",
                          borderRadius: 4,
                          transition: "width 400ms ease-out",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        left: `calc(${(r.average / r.top) * 100}% - 1px)`,
                        top: -4,
                        height: 16,
                        width: 2,
                        background: "var(--ink-muted)",
                        opacity: 0.4,
                      }}
                      aria-hidden="true"
                    />
                    <div style={{ marginTop: 4, fontSize: 10.5, color: "var(--ink-faint)" }}>
                      média da turma: {r.average}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontStyle: isLeader ? "italic" : "normal",
                      fontSize: 22,
                      color: isLeader ? "var(--accent)" : "var(--ink-muted)",
                    }}
                  >
                    {r.position}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 48,
              padding: 18,
              borderTop: "1px solid var(--border)",
              fontSize: 12,
              color: "var(--ink-faint)",
              textAlign: "center",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            Indicadores pedagógicos comparativos. Não substituem avaliação acadêmica formal.
            Avicena é ferramenta de estudo — não diagnostica, não prescreve.
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionTitle({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: 36,
        marginBottom: 14,
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: "var(--ink-muted)",
        }}
      >
        {title}
      </div>
      {right ? (
        <div style={{ fontSize: 11.5, color: "var(--ink-faint)" }}>{right}</div>
      ) : null}
    </div>
  );
}
