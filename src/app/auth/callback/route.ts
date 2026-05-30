import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

function popupHtml(message: "ok" | "fail", reason?: string) {
  const safeReason = (reason ?? "").replace(/[<>"']/g, "");
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Avicena · login</title>
<style>
body { font-family: system-ui, sans-serif; background:#F7F9F8; color:#0F1A14; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; padding:24px; text-align:center; }
.card { max-width: 360px; }
h1 { font-size: 18px; margin: 0 0 8px; }
p { font-size: 14px; color:#5A6B62; margin:0; }
</style>
</head>
<body>
<div class="card">
  <h1>${message === "ok" ? "Pronto!" : "Não rolou"}</h1>
  <p>${message === "ok" ? "Pode fechar essa janela." : safeReason || "Tenta de novo."}</p>
</div>
<script>
  (function () {
    var msg = ${JSON.stringify(`avicena-auth-${message}`)};
    // BroadcastChannel sobrevive ao corte de window.opener feito pelo COOP do Google
    try {
      var bc = new BroadcastChannel("avicena-auth");
      bc.postMessage(msg);
      bc.close();
    } catch (_) {}
    // Fallback: postMessage direto (mobile / navegadores sem BroadcastChannel)
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(msg, window.location.origin);
      }
    } catch (_) {}
    // Fecha sozinho so no sucesso; em falha deixa aberto pra ler o motivo
    if (msg === "avicena-auth-ok") {
      setTimeout(function(){ try { window.close(); } catch(_){} }, 400);
    }
  })();
</script>
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const isPopup = searchParams.get("popup") === "1";

  if (!code) {
    if (isPopup) {
      return new Response(popupHtml("fail", "callback sem code"), {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
    return NextResponse.redirect(`${origin}/?erro=callback-sem-code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // DIAGNOSTICO TEMPORARIO — remover apos resolver o login
    const all = (await cookies()).getAll();
    const cookieNames = all.map((c) => c.name);
    const hasVerifier = cookieNames.some((n) => n.includes("code-verifier"));
    console.error(
      "[auth/callback] exchange FALHOU:",
      JSON.stringify({
        message: error.message,
        status: (error as { status?: number }).status,
        code: (error as { code?: string }).code,
        isPopup,
        hasCodeVerifierCookie: hasVerifier,
        cookieNames,
      })
    );
  }

  if (isPopup) {
    return new Response(popupHtml(error ? "fail" : "ok", error?.message), {
      status: error ? 400 : 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  if (error) {
    return NextResponse.redirect(
      `${origin}/?erro=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(origin);
}
