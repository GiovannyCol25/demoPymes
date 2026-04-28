import { useMemo } from "react";
import type { LineItem, Product } from "../types";
import { money } from "../lib/format";

type DraftLine = { productId: string; qty: number; unitPrice: number };

export function LineItemsEditor({
  products,
  lines,
  onChange,
  priceField,
}: {
  products: Product[];
  lines: DraftLine[];
  onChange: (next: DraftLine[]) => void;
  priceField: "salePrice" | "costPrice";
}) {
  const options = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );

  const addLine = () => {
    const first = options[0];
    if (!first) return;
    onChange([
      ...lines,
      { productId: first.id, qty: 1, unitPrice: first[priceField] },
    ]);
  };

  const update = (index: number, patch: Partial<DraftLine>) => {
    const next = lines.map((l, i) => (i === index ? { ...l, ...patch } : l));
    if (patch.productId) {
      const p = products.find((x) => x.id === patch.productId);
      if (p) next[index] = { ...next[index], unitPrice: p[priceField] };
    }
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(lines.filter((_, i) => i !== index));
  };

  const total = lines.reduce((a, l) => a + l.qty * l.unitPrice, 0);

  return (
    <div>
      <div className="row-actions" style={{ marginBottom: "0.75rem" }}>
        <button type="button" className="btn btn--ghost" onClick={addLine} disabled={!options.length}>
          + Línea
        </button>
        <span className="stack-muted mono" style={{ marginLeft: "auto" }}>
          Subtotal: {money(total)}
        </span>
      </div>
      {!lines.length ? (
        <p className="stack-muted">Agregue líneas con el botón «+ Línea».</p>
      ) : (
        <div className="lines">
          {lines.map((line, i) => {
            const p = products.find((x) => x.id === line.productId);
            return (
              <div className="line" key={i}>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label htmlFor={`prod-${i}`}>Producto</label>
                  <select
                    id={`prod-${i}`}
                    value={line.productId}
                    onChange={(e) => update(i, { productId: e.target.value })}
                  >
                    {options.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} {priceField === "salePrice" ? `(stock ${o.stock})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label htmlFor={`qty-${i}`}>Cant.</label>
                  <input
                    id={`qty-${i}`}
                    type="number"
                    min={1}
                    step={1}
                    value={line.qty}
                    onChange={(e) => update(i, { qty: Math.max(1, Number(e.target.value) || 1) })}
                  />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label htmlFor={`price-${i}`}>P. unit.</label>
                  <input
                    id={`price-${i}`}
                    type="number"
                    min={0}
                    step={0.01}
                    value={line.unitPrice}
                    onChange={(e) => update(i, { unitPrice: Math.max(0, Number(e.target.value) || 0) })}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn--ghost line__remove"
                  aria-label="Quitar línea"
                  onClick={() => remove(i)}
                >
                  ×
                </button>
                {p && priceField === "salePrice" && line.qty > p.stock ? (
                  <p className="alert alert--error" style={{ gridColumn: "1 / -1", margin: 0 }}>
                    Supera stock disponible ({p.stock}).
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function toLineItems(lines: DraftLine[]): LineItem[] {
  return lines.map((l) => ({
    productId: l.productId,
    qty: l.qty,
    unitPrice: l.unitPrice,
  }));
}
