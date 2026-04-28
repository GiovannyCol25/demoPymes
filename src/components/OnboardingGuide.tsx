import { useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "pymeapp-onboarding-seen-v1";

export function OnboardingGuide() {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "1";
    } catch {
      return true;
    }
  });

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="onboard-backdrop" role="dialog" aria-modal="true" aria-labelledby="onboard-title">
      <div className="onboard-panel card">
        <h2 id="onboard-title" style={{ margin: "0 0 0.75rem", fontSize: "1.1rem" }}>
          Bienvenido a la demo
        </h2>
        <p className="stack-muted" style={{ margin: "0 0 1rem" }}>
          Siga estos pasos para sacar el máximo partido al recorrido (unos minutos).
        </p>
        <ol style={{ margin: "0 0 1rem", paddingLeft: "1.25rem", color: "var(--text)", lineHeight: 1.6 }}>
          <li>
            Abra <strong>Inventario</strong> y revise los productos de ejemplo y el stock actual.
          </li>
          <li>
            En <strong>Ventas</strong> y <strong>Compras</strong> verá movimientos ya registrados; añada uno nuevo
            y compruebe cómo cambia el inventario.
          </li>
          <li>
            Visite <strong>Reportes</strong> para ver KPIs, ranking y ejemplos de informes habituales en el mercado.
          </li>
          <li>
            Si desea empezar de cero, use <strong>Restaurar datos demo</strong> en la página de inicio.
          </li>
        </ol>
        <div className="row-actions">
          <button type="button" className="btn btn--primary" onClick={dismiss}>
            Entendido, continuar
          </button>
          <Link to="/inventario" className="btn btn--ghost" onClick={dismiss}>
            Ir al inventario
          </Link>
        </div>
      </div>
    </div>
  );
}
