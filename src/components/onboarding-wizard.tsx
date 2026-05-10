"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Heart,
  Pill,
  Stethoscope,
  Sparkles,
  Sprout,
  Dna,
  BookOpenText,
  Building2,
  CalendarRange,
  Users,
  Loader2,
} from "lucide-react";
import { AvicenaMark } from "@/components/avicena";
import { completeOnboarding } from "@/app/actions/onboarding";

type Course = {
  id: string;
  label: string;
  icon: typeof Stethoscope;
};

const COURSES: Course[] = [
  { id: "medicina", label: "Medicina", icon: Stethoscope },
  { id: "enfermagem", label: "Enfermagem", icon: Heart },
  { id: "fisioterapia", label: "Fisioterapia", icon: Sparkles },
  { id: "farmacia", label: "Farmácia", icon: Pill },
  { id: "odontologia", label: "Odontologia", icon: BookOpenText },
  { id: "nutricao", label: "Nutrição", icon: Sprout },
  { id: "biomedicina", label: "Biomedicina", icon: Dna },
  { id: "outro", label: "Outro", icon: GraduationCap },
];

const PERIODS = [
  "1º semestre",
  "2º semestre",
  "3º semestre",
  "4º semestre",
  "5º semestre",
  "6º semestre",
  "7º semestre",
  "8º semestre",
  "9º semestre",
  "10º semestre",
  "11º semestre",
  "12º semestre",
  "internato",
  "residência",
];

const TOTAL_STEPS = 3;

type Props = {
  defaultDisplayName: string;
};

export function OnboardingWizard({ defaultDisplayName }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState(defaultDisplayName);
  const [pronouns, setPronouns] = useState("");
  const [course, setCourse] = useState<string>("medicina");
  const [period, setPeriod] = useState<string>("");
  const [cohort, setCohort] = useState("");
  const [academy, setAcademy] = useState("");

  function canAdvance() {
    if (step === 1) return displayName.trim().length >= 2;
    if (step === 2) return !!course && !!period && cohort.trim().length >= 2;
    if (step === 3) return academy.trim().length >= 2;
    return false;
  }

  function next() {
    setError(null);
    if (!canAdvance()) {
      setError("Preenche os campos obrigatórios antes de seguir.");
      return;
    }
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      submit();
    }
  }

  function back() {
    setError(null);
    if (step > 1) setStep(step - 1);
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await completeOnboarding({
        displayName: displayName.trim(),
        pronouns: pronouns.trim() || undefined,
        course,
        period,
        cohort: cohort.trim(),
        academy: academy.trim(),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div
      className="av"
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="av-aurora" />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top */}
        <header
          style={{
            padding: "22px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AvicenaMark size={28} />
            <span className="serif" style={{ fontSize: 19, fontWeight: 600 }}>
              Avicena
            </span>
          </div>
          <div
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-faint)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            primeira consulta · {step} de {TOTAL_STEPS}
          </div>
        </header>

        {/* Progress */}
        <div style={{ padding: "0 28px", marginBottom: 32 }}>
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              display: "flex",
              gap: 6,
            }}
          >
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  background:
                    i + 1 <= step ? "var(--brand)" : "var(--border)",
                  transition: "background 240ms ease-out",
                }}
              />
            ))}
          </div>
        </div>

        {/* Wizard body */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "0 24px 32px",
          }}
        >
          <div
            style={{
              maxWidth: 720,
              width: "100%",
              background: "var(--bg-elev-1)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: "40px 36px 32px",
              boxShadow: "var(--av-shadow-md)",
            }}
            className="av-onb-card"
          >
            {step === 1 && (
              <Step1
                displayName={displayName}
                setDisplayName={setDisplayName}
                pronouns={pronouns}
                setPronouns={setPronouns}
              />
            )}
            {step === 2 && (
              <Step2
                course={course}
                setCourse={setCourse}
                period={period}
                setPeriod={setPeriod}
                cohort={cohort}
                setCohort={setCohort}
              />
            )}
            {step === 3 && (
              <Step3
                academy={academy}
                setAcademy={setAcademy}
                displayName={displayName}
                course={course}
                period={period}
                cohort={cohort}
              />
            )}

            {error && (
              <div
                style={{
                  marginTop: 18,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "var(--alert-bg)",
                  border: "1px solid var(--alert-soft)",
                  color: "var(--alert)",
                  fontSize: 13,
                }}
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Nav */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 32,
                paddingTop: 24,
                borderTop: "1px solid var(--border)",
              }}
            >
              <button
                type="button"
                onClick={back}
                disabled={step === 1 || pending}
                className="av-btn-ghost"
                style={{ opacity: step === 1 ? 0.4 : 1 }}
              >
                <ArrowLeft size={16} /> Voltar
              </button>
              <div style={{ flex: 1 }} />
              <button
                type="button"
                onClick={next}
                disabled={pending}
                className="av-btn-primary"
              >
                {pending ? (
                  <>
                    <Loader2 size={16} className="av-spin" /> Salvando…
                  </>
                ) : step === TOTAL_STEPS ? (
                  <>
                    <Check size={16} /> Abrir o Consultório
                  </>
                ) : (
                  <>
                    Continuar <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <footer
          style={{
            padding: "16px 28px 28px",
            fontSize: 12,
            color: "var(--ink-faint)",
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          Material de estudo. Não substitui avaliação clínica presencial.
        </footer>
      </div>
    </div>
  );
}

// ============================================================================
// STEPS
// ============================================================================

function Step1({
  displayName,
  setDisplayName,
  pronouns,
  setPronouns,
}: {
  displayName: string;
  setDisplayName: (v: string) => void;
  pronouns: string;
  setPronouns: (v: string) => void;
}) {
  return (
    <div>
      <Eyebrow>Antes do consultório abrir</Eyebrow>
      <Title>
        Como <span style={{ fontStyle: "italic", color: "var(--brand)" }}>o Hipócrates</span> deve te chamar?
      </Title>
      <Sub>
        Tu vai ver esse nome em todo parecer, todo bom-dia, toda sabatina.
        Pode ser teu primeiro nome só.
      </Sub>

      <FieldLabel>Como deve ser chamado · obrigatório</FieldLabel>
      <Input
        autoFocus
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="ex: Marina"
        maxLength={50}
      />

      <div style={{ height: 18 }} />

      <FieldLabel>Pronomes · opcional</FieldLabel>
      <Input
        value={pronouns}
        onChange={(e) => setPronouns(e.target.value)}
        placeholder="ex: ela / dele / elu"
        maxLength={20}
      />
    </div>
  );
}

function Step2({
  course,
  setCourse,
  period,
  setPeriod,
  cohort,
  setCohort,
}: {
  course: string;
  setCourse: (v: string) => void;
  period: string;
  setPeriod: (v: string) => void;
  cohort: string;
  setCohort: (v: string) => void;
}) {
  return (
    <div>
      <Eyebrow>Tua formação</Eyebrow>
      <Title>
        Em qual <span style={{ fontStyle: "italic", color: "var(--brand)" }}>cátedra</span> tu tá?
      </Title>
      <Sub>
        Isso muda o tom do Hipócrates, as sugestões e o que aparece no teu Consultório.
      </Sub>

      <FieldLabel>Curso · obrigatório</FieldLabel>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 10,
          marginBottom: 24,
        }}
      >
        {COURSES.map((c) => {
          const I = c.icon;
          const active = course === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCourse(c.id)}
              className={`av-onb-chip ${active ? "is-active" : ""}`}
            >
              <I size={16} />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
        className="av-onb-row"
      >
        <div>
          <FieldLabel>Período · obrigatório</FieldLabel>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="">selecionar…</option>
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>Turma · obrigatório</FieldLabel>
          <Input
            value={cohort}
            onChange={(e) => setCohort(e.target.value)}
            placeholder="ex: M3-2026.1"
            maxLength={30}
          />
        </div>
      </div>
    </div>
  );
}

function Step3({
  academy,
  setAcademy,
  displayName,
  course,
  period,
  cohort,
}: {
  academy: string;
  setAcademy: (v: string) => void;
  displayName: string;
  course: string;
  period: string;
  cohort: string;
}) {
  const courseLabel =
    COURSES.find((c) => c.id === course)?.label ?? course;

  return (
    <div>
      <Eyebrow>Falta pouco</Eyebrow>
      <Title>
        E em qual <span style={{ fontStyle: "italic", color: "var(--brand)" }}>academia</span>?
      </Title>
      <Sub>
        Faculdade, universidade, centro universitário. Mesmo nome que tá no diário.
      </Sub>

      <FieldLabel>Academia · obrigatório</FieldLabel>
      <Input
        autoFocus
        value={academy}
        onChange={(e) => setAcademy(e.target.value)}
        placeholder="ex: UNIFAC · Faculdade de Medicina"
        maxLength={80}
      />

      <div
        style={{
          marginTop: 28,
          padding: 18,
          borderRadius: 14,
          background: "var(--bg-elev-2)",
          border: "1px dashed var(--border-strong)",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.10em",
            color: "var(--ink-faint)",
            marginBottom: 12,
          }}
        >
          confirma teu juramento
        </div>
        <SummaryRow icon={Stethoscope} label="Nome" value={displayName || "—"} />
        <SummaryRow icon={GraduationCap} label="Curso" value={courseLabel} />
        <SummaryRow icon={CalendarRange} label="Período" value={period || "—"} />
        <SummaryRow icon={Users} label="Turma" value={cohort || "—"} />
        <SummaryRow
          icon={Building2}
          label="Academia"
          value={academy || "—"}
          last
        />
      </div>
    </div>
  );
}

// ============================================================================
// PRIMITIVES locais
// ============================================================================

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "var(--accent)",
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="serif"
      style={{
        fontSize: "clamp(24px, 3.4vw, 32px)",
        fontWeight: 600,
        letterSpacing: "-0.015em",
        lineHeight: 1.15,
        marginBottom: 10,
        color: "var(--ink)",
      }}
    >
      {children}
    </h1>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 14.5,
        color: "var(--ink-muted)",
        lineHeight: 1.55,
        marginBottom: 26,
      }}
    >
      {children}
    </p>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.10em",
        color: "var(--ink-muted)",
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="text" className="av-onb-input" {...props} />;
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="av-onb-input" {...props} />;
}

function SummaryRow({
  icon: I,
  label,
  value,
  last,
}: {
  icon: typeof Stethoscope;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        gap: 12,
        alignItems: "center",
        paddingBottom: last ? 0 : 8,
        marginBottom: last ? 0 : 8,
        borderBottom: last ? "none" : "1px solid var(--border)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12.5,
          color: "var(--ink-muted)",
          fontWeight: 500,
        }}
      >
        <I size={14} />
        {label}
      </div>
      <div style={{ fontSize: 14, color: "var(--ink)", fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}
