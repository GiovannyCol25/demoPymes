import { Link } from "react-router-dom";
import { OnboardingGuide } from "../components/OnboardingGuide";
import { useApp } from "../context/AppContext";
import { money } from "../lib/format";

export function Home() {
  const { products, sales, resetDemo } = useApp();
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 15).length;
  const totalStock = products.reduce((a, p) => a + p.stock, 0);
  const salesMonth = sales.filter((s) => {
    const d = new Date(s.createdAt);
    const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  });
  const revenueMonth = salesMonth.reduce((a, s) => a + s.total, 0);

  return (
    <>
      <OnboardingGuide />
      <header className="page-head">
        <div>
          <h1>Bienvenido</h1>
          <p>
            Explore compras, ventas, inventario y reportes. Los cambios se guardan en este navegador para
            que pueda probar flujos sin servidor. Use cerrar sesión al terminar en equipos compartidos.
          </p>
        </div>
        <div className="row-actions">
          <button type="button" className="btn btn--ghost" onClick={() => resetDemo()}>
            Restaurar datos demo
          </button>
        </div>
      </header>

      <div className="grid-kpi">
        <div className="kpi">
          <div className="kpi__label">Productos</div>
          <div className="kpi__value">{products.length}</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Unidades en stock</div>
          <div className="kpi__value mono">{totalStock}</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Alertas stock bajo</div>
          <div className="kpi__value">{lowStock}</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Ventas del mes</div>
          <div className="kpi__value mono" style={{ fontSize: "1.1rem" }}>
            {money(revenueMonth)}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ margin: "0 0 0.75rem", fontSize: "1rem" }}>Accesos rápidos</h2>
        <div className="row-actions">
          <Link to="/inventario/nuevo" className="btn btn--primary">
            Nuevo producto
          </Link>
          <Link to="/ventas/nueva" className="btn btn--primary">
            Registrar venta
          </Link>
          <Link to="/compras/nueva" className="btn btn--primary">
            Registrar compra
          </Link>
          <Link to="/reportes" className="btn btn--ghost">
            Ver reportes
          </Link>
        </div>
      </div>
    </>
  );
}
