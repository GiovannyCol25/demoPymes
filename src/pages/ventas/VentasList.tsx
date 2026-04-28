import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { money, dateShort } from "../../lib/format";

export function VentasList() {
  const { sales, products } = useApp();
  const nameById = new Map(products.map((p) => [p.id, p.name]));

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Ventas</h1>
          <p>Consulte ventas registradas y el detalle por producto. Desde aquí puede ir a registrar una nueva.</p>
        </div>
        <Link to="/ventas/nueva" className="btn btn--primary">
          Nueva venta
        </Link>
      </header>

      <div className="card">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Detalle</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td className="mono">{dateShort(s.createdAt)}</td>
                  <td>{s.customer}</td>
                  <td>
                    <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
                      {s.items.map((it, i) => (
                        <li key={i} className="stack-muted">
                          {nameById.get(it.productId) ?? it.productId} × {it.qty} @ {money(it.unitPrice)}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="mono">{money(s.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!sales.length ? <p className="stack-muted">Aún no hay ventas. Registre la primera.</p> : null}
      </div>
    </>
  );
}
