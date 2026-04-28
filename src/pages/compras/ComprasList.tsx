import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { money, dateShort } from "../../lib/format";

export function ComprasList() {
  const { purchases, products } = useApp();
  const nameById = new Map(products.map((p) => [p.id, p.name]));

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Compras</h1>
          <p>Historial de compras a proveedor. Cada registro incrementa el stock de los productos indicados.</p>
        </div>
        <Link to="/compras/nueva" className="btn btn--primary">
          Nueva compra
        </Link>
      </header>

      <div className="card">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Proveedor</th>
                <th>Detalle</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((c) => (
                <tr key={c.id}>
                  <td className="mono">{dateShort(c.createdAt)}</td>
                  <td>{c.supplier}</td>
                  <td>
                    <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
                      {c.items.map((it, i) => (
                        <li key={i} className="stack-muted">
                          {nameById.get(it.productId) ?? it.productId} × {it.qty} @ {money(it.unitPrice)}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="mono">{money(c.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!purchases.length ? <p className="stack-muted">Aún no hay compras. Registre la primera.</p> : null}
      </div>
    </>
  );
}
