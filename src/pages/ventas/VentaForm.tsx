import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LineItemsEditor, toLineItems } from "../../components/LineItemsEditor";
import { useApp } from "../../context/AppContext";

type DraftLine = { productId: string; qty: number; unitPrice: number };

export function VentaForm() {
  const { products, createSale } = useApp();
  const nav = useNavigate();
  const [customer, setCustomer] = useState("");
  const [lines, setLines] = useState<DraftLine[]>([]);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = createSale(customer, toLineItems(lines));
    if (!res.ok) {
      setError(res.error);
      return;
    }
    nav("/ventas");
  };

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Nueva venta</h1>
          <p>Seleccione productos y cantidades. El stock se descuenta al guardar.</p>
        </div>
        <Link to="/ventas" className="btn btn--ghost">
          Volver al listado
        </Link>
      </header>

      <form className="card" onSubmit={submit}>
        {error ? (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        ) : null}
        <div className="field">
          <label htmlFor="customer">Cliente</label>
          <input
            id="customer"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Mostrador"
            maxLength={80}
          />
        </div>
        <LineItemsEditor products={products} lines={lines} onChange={setLines} priceField="salePrice" />
        <div className="row-actions" style={{ marginTop: "1rem" }}>
          <button type="submit" className="btn btn--primary" disabled={!lines.length}>
            Confirmar venta
          </button>
          <Link to="/ventas" className="btn btn--ghost">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
