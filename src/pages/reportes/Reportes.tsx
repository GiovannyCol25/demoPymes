import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { money } from "../../lib/format";

const STOCK_MIN_DEMO = 20;

export function Reportes() {
  const { products, sales, purchases } = useApp();

  const invValue = useMemo(
    () => products.reduce((a, p) => a + p.stock * p.costPrice, 0),
    [products]
  );

  const salesTotal = useMemo(() => sales.reduce((a, s) => a + s.total, 0), [sales]);
  const purchasesTotal = useMemo(() => purchases.reduce((a, p) => a + p.total, 0), [purchases]);

  const topProducts = useMemo(() => {
    const map = new Map<string, { qty: number; revenue: number }>();
    for (const s of sales) {
      for (const it of s.items) {
        const cur = map.get(it.productId) ?? { qty: 0, revenue: 0 };
        cur.qty += it.qty;
        cur.revenue += it.qty * it.unitPrice;
        map.set(it.productId, cur);
      }
    }
    const names = new Map(products.map((p) => [p.id, p.name]));
    return [...map.entries()]
      .map(([id, v]) => ({ id, name: names.get(id) ?? id, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [sales, products]);

  const maxRev = topProducts[0]?.revenue ?? 1;

  const costOfGoodsSold = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    let sum = 0;
    for (const s of sales) {
      for (const it of s.items) {
        const p = byId.get(it.productId);
        if (p) sum += it.qty * p.costPrice;
      }
    }
    return sum;
  }, [sales, products]);

  const grossMargin = salesTotal - costOfGoodsSold;
  const marginPct = salesTotal > 0 ? (grossMargin / salesTotal) * 100 : 0;

  const turnoverRatio = invValue > 0 ? costOfGoodsSold / invValue : 0;
  const daysOnHand = turnoverRatio > 0 ? 365 / turnoverRatio : null;

  const abcRows = useMemo(() => {
    const rows = products
      .map((p) => ({
        id: p.id,
        name: p.name,
        value: p.stock * p.costPrice,
      }))
      .sort((a, b) => b.value - a.value);
    const total = rows.reduce((a, r) => a + r.value, 0) || 1;
    let cum = 0;
    return rows.map((r) => {
      cum += r.value;
      const cumPct = (cum / total) * 100;
      const cls = cumPct <= 80 ? "A" : cumPct <= 95 ? "B" : "C";
      return { ...r, cumPct, cls, share: (r.value / total) * 100 };
    });
  }, [products]);

  const belowMin = useMemo(
    () => products.filter((p) => p.stock < STOCK_MIN_DEMO).sort((a, b) => a.stock - b.stock),
    [products]
  );

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Reportes</h1>
          <p>
            KPIs en vivo según sus datos, más referencias a informes que suelen pedirse en ERP y retail
            (libros regulatorios, ABC, rotación, márgenes, reorden).
          </p>
        </div>
        <div className="row-actions">
          <Link to="/ventas/nueva" className="btn btn--primary">
            Nueva venta
          </Link>
          <Link to="/inventario" className="btn btn--ghost">
            Inventario
          </Link>
        </div>
      </header>

      <div className="grid-kpi">
        <div className="kpi">
          <div className="kpi__label">Valor inventario (costo)</div>
          <div className="kpi__value mono" style={{ fontSize: "1.15rem" }}>
            {money(invValue)}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Ventas acumuladas</div>
          <div className="kpi__value mono" style={{ fontSize: "1.15rem" }}>
            {money(salesTotal)}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Margen bruto (aprox.)</div>
          <div className="kpi__value mono" style={{ fontSize: "1.05rem" }}>
            {money(grossMargin)}
            <span className="stack-muted" style={{ fontSize: "0.75rem", marginLeft: "0.35rem" }}>
              ({marginPct.toFixed(1)}%)
            </span>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Compras acumuladas</div>
          <div className="kpi__value mono" style={{ fontSize: "1.15rem" }}>
            {money(purchasesTotal)}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ margin: "0 0 0.5rem", fontSize: "1rem" }}>Margen y costo de ventas (demo)</h2>
        <p className="stack-muted" style={{ margin: "0 0 1rem" }}>
          Costo de ventas calculado con el <strong>costo actual</strong> del producto × unidades vendidas (en un ERP
          real suele usarse costo medio o PEPS). Margen bruto = ventas − ese costo.
        </p>
        <div className="row-actions" style={{ marginBottom: "0.5rem" }}>
          <span className="stack-muted">Costo de ventas (aprox.):</span>
          <strong className="mono">{money(costOfGoodsSold)}</strong>
        </div>
        <div className="bar">
          <span
            style={{
              width: `${Math.min(100, salesTotal > 0 ? (costOfGoodsSold / salesTotal) * 100 : 0)}%`,
              background: "linear-gradient(90deg, #64748b, #94a3b8)",
            }}
          />
        </div>
        <p className="stack-muted" style={{ margin: "0.75rem 0 0", fontSize: "0.8rem" }}>
          Barra: participación del costo sobre el total facturado en ventas del periodo acumulado.
        </p>
      </div>

      <div className="card">
        <h2 style={{ margin: "0 0 0.5rem", fontSize: "1rem" }}>Rotación y días de inventario (indicador)</h2>
        <p className="stack-muted" style={{ margin: "0 0 0.75rem" }}>
          En el mercado se usa a menudo: <em>rotación = costo de ventas / inventario promedio</em>; aquí mostramos un
          cociente orientativo (costo de ventas / valor actual del inventario) para la demo sin histórico de
          saldos.
        </p>
        <div className="grid-kpi" style={{ marginBottom: 0 }}>
          <div className="kpi">
            <div className="kpi__label">Cociente costo ventas / inv. actual</div>
            <div className="kpi__value mono">{turnoverRatio.toFixed(2)}</div>
          </div>
          <div className="kpi">
            <div className="kpi__label">Días de inventario aprox.</div>
            <div className="kpi__value mono">{daysOnHand != null ? Math.round(daysOnHand) : "—"}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ margin: "0 0 0.5rem", fontSize: "1rem" }}>Clasificación ABC (Pareto sobre valor en stock)</h2>
        <p className="stack-muted" style={{ margin: "0 0 0.75rem" }}>
          Clásico en retail y mayoristas: categoría <strong>A</strong> concentra ~80% del valor, <strong>B</strong>
          el siguiente 15%, <strong>C</strong> el resto. Criterio demo: valor = stock × costo.
        </p>
        <table className="report-table-mini">
          <thead>
            <tr>
              <th>SKU valor</th>
              <th>Clase</th>
              <th>Valor</th>
              <th>% acum.</th>
            </tr>
          </thead>
          <tbody>
            {abcRows.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>
                  <span
                    className={
                      "badge" + (r.cls === "A" ? " badge--ok" : r.cls === "B" ? "" : " badge--low")
                    }
                    style={r.cls === "B" ? { background: "var(--accent-dim)", color: "var(--accent)" } : undefined}
                  >
                    {r.cls}
                  </span>
                </td>
                <td className="mono">{money(r.value)}</td>
                <td className="mono">{r.cumPct.toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 style={{ margin: "0 0 0.5rem", fontSize: "1rem" }}>Stock bajo mínimo (demo: mín. {STOCK_MIN_DEMO} uds.)</h2>
        <p className="stack-muted" style={{ margin: "0 0 0.75rem" }}>
          Informe típico de <strong>existencias vs. punto de pedido</strong> o mínimo por SKU. Aquí el umbral es fijo
          para la demo.
        </p>
        {!belowMin.length ? (
          <p className="stack-muted">Ningún producto por debajo del mínimo de ejemplo.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
            {belowMin.map((p) => (
              <li key={p.id}>
                <strong>{p.name}</strong> — stock {p.stock}{" "}
                <Link to={`/inventario/${p.id}`}>revisar</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h2 style={{ margin: "0 0 1rem", fontSize: "1rem" }}>Productos más vendidos (por ingresos)</h2>
        {!topProducts.length ? (
          <p className="stack-muted">Registre ventas para ver el ranking.</p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {topProducts.map((row) => (
              <li
                key={row.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "0.5rem 1rem",
                  alignItems: "center",
                  padding: "0.6rem 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{row.name}</div>
                  <div className="stack-muted" style={{ fontSize: "0.8rem" }}>
                    {row.qty} uds. vendidas
                  </div>
                  <div className="bar" style={{ marginTop: "0.45rem" }}>
                    <span style={{ width: `${Math.max(8, (row.revenue / maxRev) * 100)}%` }} />
                  </div>
                </div>
                <div className="mono" style={{ fontWeight: 700 }}>
                  {money(row.revenue)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h2 style={{ margin: "0 0 0.75rem", fontSize: "1rem" }}>Informes habituales en el mercado (referencia)</h2>
        <p className="stack-muted" style={{ margin: "0 0 1rem" }}>
          Ejemplos de lo que suelen pedir PYMEs a sus sistemas o consultores; la demo anterior cubre parte del
          análisis con sus datos locales.
        </p>
        <div className="report-market">
          <div className="report-market__item">
            <h3>Libro de ventas e inventarios</h3>
            <p>
              Requerimiento frecuente ante administraciones tributarias: correlativo de facturas, stock por
              bodega y valorización. En ERP se exporta a Excel o XML según normativa local.
            </p>
          </div>
          <div className="report-market__item">
            <h3>Cuadre de caja vs. ventas (T+P)</h3>
            <p>
              Conciliación diaria entre efectivo, POS y ventas registradas; detecta diferencias y devoluciones.
              Muchas cadenas lo automatizan con arqueos por turno.
            </p>
          </div>
          <div className="report-market__item">
            <h3>Proyección de compras y reorden</h3>
            <p>
              Según rotación, lead time del proveedor y stock de seguridad; genera sugerencias de pedido por SKU.
              Complemento natural del análisis ABC.
            </p>
          </div>
          <div className="report-market__item">
            <h3>Estado de resultados por centro de costo</h3>
            <p>
              Ventas, costo de ventas, gastos operativos y margen por tienda o canal (retail, mayorista, e‑commerce).
              Base para tableros ejecutivos tipo Power BI.
            </p>
          </div>
          <div className="report-market__item">
            <h3>Trazabilidad y lote / caducidad</h3>
            <p>
              En alimentos y farmacia: reportes de lote, fecha de caducidad y recall. No modelado en esta demo
              pero es estándar en WMS medianos.
            </p>
          </div>
          <div className="report-market__item">
            <h3>Antigüedad de saldos (cartera)</h3>
            <p>
              Clasificación 30-60-90 días de cuentas por cobrar y pagar; en inventario, analógico para stock
              muerto o obsoleto sin movimiento.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
