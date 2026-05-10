"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Common = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  iconRight?: ReactNode;
};

export function BtnPrimary({
  children,
  icon,
  iconRight,
  className,
  ...rest
}: Common) {
  return (
    <button
      type="button"
      className={["av-btn-primary", className ?? ""].filter(Boolean).join(" ")}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

export function BtnGhost({ children, icon, className, ...rest }: Common) {
  return (
    <button
      type="button"
      className={["av-btn-ghost", className ?? ""].filter(Boolean).join(" ")}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

export function BtnSoft({ children, icon, className, ...rest }: Common) {
  return (
    <button
      type="button"
      className={["av-btn-soft", className ?? ""].filter(Boolean).join(" ")}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
