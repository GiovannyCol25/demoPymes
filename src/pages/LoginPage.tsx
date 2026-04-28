import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export function LoginPage() {
  const { authed, login, demoConfigured } = useAuth();
  const loc = useLocation();
  const from = (loc.state as { from?: string } | null)?.from ?? "/";

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (authed) {
    return <Navigate to={from === "/login" ? "/" : from} replace />;
  }

  const showDevHint = import.meta.env.DEV;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const r = login(user, pass);
    if (!r.ok) setError(r.error);
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <header className="login-card__head">
          <h1 className="login-card__title">Inventario PYME</h1>
          <p className="login-card__sub">Acceso a la demo</p>
        </header>

        {!demoConfigured ? (
          <div className="alert alert--warn" role="status">
            Esta versión en producción necesita variables{" "}
            <code className="login-code">VITE_DEMO_USERNAME</code> y{" "}
            <code className="login-code">VITE_DEMO_PASSWORD</code> en Vercel. No almacene aquí
            contraseñas de GitHub, Vercel ni otros servicios: solo un usuario y clave exclusivos para
            esta demo.
          </div>
        ) : null}

        {showDevHint && demoConfigured ? (
          <div className="alert alert--info" role="note">
            <strong>Modo desarrollo:</strong> puede usar usuario <code className="login-code">demo</code> y
            contraseña <code className="login-code">pyme2026</code> salvo que haya definido variables{" "}
            <code className="login-code">VITE_*</code> en <code className="login-code">.env.local</code>.
          </div>
        ) : null}

        <section className="login-guide" aria-labelledby="login-guide-title">
          <h2 id="login-guide-title" className="login-guide__title">
            Guía rápida
          </h2>
          <ol className="login-guide__list">
            <li>Inicie sesión con las credenciales de prueba (no son cuentas reales de ningún servicio).</li>
            <li>Revise el inventario y los ejemplos de ventas y compras ya cargados.</li>
            <li>Registre una venta o compra nueva y observe el stock y los reportes.</li>
            <li>Use «Restaurar datos demo» en inicio si desea volver al estado inicial.</li>
            <li>Cierre sesión al terminar, especialmente en equipos compartidos.</li>
          </ol>
          <p className="login-guide__note">
            Los datos se guardan solo en su navegador (localStorage). Cierre sesión al terminar, especialmente en equipos compartidos.
          </p>
        </section>

        <form className="login-form" onSubmit={onSubmit}>
          {error ? (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          ) : null}
          <div className="field">
            <label htmlFor="login-user">Usuario</label>
            <input
              id="login-user"
              name="username"
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              maxLength={64}
            />
          </div>
          <div className="field">
            <label htmlFor="login-pass">Contraseña</label>
            <input
              id="login-pass"
              name="password"
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              maxLength={128}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--block" disabled={!demoConfigured}>
            Entrar a la demo
          </button>
        </form>

        <footer className="login-foot">
          <span>
            © {new Date().getFullYear()} <strong>GioSoftwareSolutions</strong>
          </span>
        </footer>
      </div>
    </div>
  );
}
