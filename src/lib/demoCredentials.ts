/**
 * Credenciales solo para esta demo en el navegador.
 * No incluya tokens de Vercel, GitHub ni ningún servicio real.
 *
 * En producción (build): defina VITE_DEMO_USERNAME y VITE_DEMO_PASSWORD
 * en el panel de Vercel (Environment Variables). En desarrollo puede omitirse
 * y se usan valores por defecto solo en localhost.
 */
export function getDemoCredentials(): { username: string; password: string; configured: boolean } {
  const u = (import.meta.env.VITE_DEMO_USERNAME as string | undefined)?.trim() ?? "";
  const p = (import.meta.env.VITE_DEMO_PASSWORD as string | undefined)?.trim() ?? "";

  if (import.meta.env.DEV) {
    return {
      username: u || "demo",
      password: p || "pyme2026",
      configured: true,
    };
  }

  if (!u || !p) {
    return { username: "", password: "", configured: false };
  }
  return { username: u, password: p, configured: true };
}

/** Comparación en tiempo constante para credenciales de texto plano en cliente. */
export function timingSafeEqualString(a: string, b: string): boolean {
  const normA = a.normalize("NFKC");
  const normB = b.normalize("NFKC");
  if (normA.length !== normB.length) return false;
  let out = 0;
  for (let i = 0; i < normA.length; i++) {
    out |= normA.charCodeAt(i) ^ normB.charCodeAt(i);
  }
  return out === 0;
}
