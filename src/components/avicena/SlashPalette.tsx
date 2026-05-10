"use client";

import {
  BookOpenText,
  Lightbulb,
  HelpCircle,
  UserSearch,
  GitCompare,
  Pill,
} from "lucide-react";
import type { ComponentType } from "react";

export type SlashCmd = {
  cmd: string;
  desc: string;
  icon: ComponentType<{ size?: number }>;
  hint?: string;
};

export const SLASH_CMDS: SlashCmd[] = [
  {
    cmd: "/resumir",
    desc: "Resume capítulo, sistema ou livro inteiro",
    icon: BookOpenText,
    hint: "Tab",
  },
  {
    cmd: "/explicar",
    desc: "Mecanismo + manifestações + ângulo prova",
    icon: Lightbulb,
    hint: "⇥",
  },
  {
    cmd: "/quizar",
    desc: "Gera 5 questões estilo Revalida / ENARE",
    icon: HelpCircle,
    hint: "⇥",
  },
  {
    cmd: "/caso",
    desc: "Simula apresentação clínica completa",
    icon: UserSearch,
    hint: "⇥",
  },
  {
    cmd: "/diferenciar",
    desc: "Tabela comparativa lado a lado",
    icon: GitCompare,
    hint: "⇥",
  },
  {
    cmd: "/dose",
    desc: "Posologia, ajustes, contraindicações",
    icon: Pill,
    hint: "⇥",
  },
];

type Props = {
  activeIndex?: number;
  compact?: boolean;
  onSelect?: (cmd: string) => void;
};

export function SlashPalette({ activeIndex = 0, compact, onSelect }: Props) {
  return (
    <div className="av-palette" style={{ width: compact ? 320 : 460 }}>
      <div className="av-palette-header">Comandos</div>
      {SLASH_CMDS.map((c, i) => {
        const I = c.icon;
        return (
          <button
            key={c.cmd}
            className={`av-palette-item ${i === activeIndex ? "active" : ""}`}
            onClick={() => onSelect?.(c.cmd)}
            type="button"
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: i === activeIndex ? "var(--brand-soft-bg)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--brand)",
                flexShrink: 0,
              }}
            >
              <I size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                className="mono"
                style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500 }}
              >
                {c.cmd}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-muted)", marginTop: 1 }}>
                {c.desc}
              </div>
            </div>
            {c.hint && (
              <div
                className="mono"
                style={{
                  fontSize: 10.5,
                  color: "var(--ink-faint)",
                  padding: "2px 6px",
                  border: "1px solid var(--border)",
                  borderRadius: 5,
                  flexShrink: 0,
                }}
              >
                {c.hint}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
