import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LineItemsEditor, toLineItems } from "../../components/LineItemsEditor";
import { useApp } from "../../context/AppContext";

type DraftLine = { productId: string; qty: number; unitPrice: number };

export function CompraForm() {
  const { products, createPurchase } = useApp();
  const nav = useNavigate();
  const [supplier, setSupplier] = useState("");
  const [lines, setLines] = useState<DraftLine[]>([]);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = createPurchase(supplier, toLineItems(lines));
    if (!res.ok) {
      setError(res.error);
      return;
    }
    nav("/compras");
  };

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Nueva compra</h1>
          <p>Registre mercadería recibida. El stock aumenta al confirmar.</p>
        </div>
        <Link to="/compras" className="btn btn--ghost">
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
          <label htmlFor="supplier">Proveedor</label>
          <input
            id="supplier"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Nombre del proveedor"
            maxLength={80}
          />
        </div>
        <LineItemsEditor products={products} lines={lines} onChange={setLines} priceField="costPrice" />
        <div className="row-actions" style={{ marginTop: "1rem" }}>
          <button type="submit" className="btn btn--primary" disabled={!lines.length}>
            Confirmar compra
          </button>
          <Link to="/compras" className="btn btn--ghost">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
