"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  className?: string;
  children: ReactNode;
};

function isMobileLike() {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const ua = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return coarse || ua;
}

export function GoogleLoginButton({ className, children }: Props) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleResult(data: unknown) {
      if (data === "avicena-auth-ok") {
        window.location.reload();
      }
    }
    // Canal principal: funciona mesmo com o COOP do Google cortando window.opener
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("avicena-auth");
      bc.onmessage = (e) => handleResult(e.data);
    } catch {}
    // Fallback: postMessage direto da janela do callback
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      handleResult(e.data);
    }
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      bc?.close();
    };
  }, []);

  async function handle() {
    if (loading) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const mobile = isMobileLike();
      const origin = window.location.origin;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: mobile
            ? `${origin}/auth/callback`
            : `${origin}/auth/callback?popup=1`,
          skipBrowserRedirect: true,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });

      if (error || !data?.url) {
        alert(`Erro ao iniciar login: ${error?.message ?? "sem URL"}`);
        setLoading(false);
        return;
      }

      if (mobile) {
        window.location.href = data.url;
        return;
      }

      const w = 500;
      const h = 640;
      const left = window.screenX + (window.outerWidth - w) / 2;
      const top = window.screenY + (window.outerHeight - h) / 2;
      const popup = window.open(
        data.url,
        "avicena-oauth",
        `width=${w},height=${h},left=${left},top=${top},popup=yes,scrollbars=yes`
      );

      if (!popup) {
        window.location.href = data.url;
        return;
      }

      const interval = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(interval);
            window.location.reload();
          }
        } catch {}
      }, 500);
    } catch (err) {
      alert(`Falha no login: ${(err as Error).message}`);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handle}
      disabled={loading}
    >
      {children}
    </button>
  );
}
