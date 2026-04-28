import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export function InventarioForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const { getProduct, upsertProduct } = useApp();
  const editing = Boolean(id);

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);

  useEffect(() => {
    if (!id) return;
    const p = getProduct(id);
    if (!p) {
      nav("/inventario", { replace: true });
      return;
    }
    setSku(p.sku);
    setName(p.name);
    setCategory(p.category);
    setStock(p.stock);
    setCostPrice(p.costPrice);
    setSalePrice(p.salePrice);
  }, [id, getProduct, nav]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertProduct({
      id: id || undefined,
      sku: sku.trim(),
      name: name.trim(),
      category: category.trim() || "General",
      stock: Math.max(0, Math.floor(stock)),
      costPrice: Math.max(0, costPrice),
      salePrice: Math.max(0, salePrice),
    });
    nav("/inventario");
  };

  return (
    <>
      <header className="page-head">
        <div>
          <h1>{editing ? "Editar producto" : "Nuevo producto"}</h1>
          <p>Complete los datos. El stock aquí es el nivel actual (ajuste manual); ventas y compras lo actualizan automáticamente.</p>
        </div>
        <Link to="/inventario" className="btn btn--ghost">
          Volver al listado
        </Link>
      </header>

      <form className="card" onSubmit={submit}>
        <div className="field">
          <label htmlFor="sku">SKU</label>
          <input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} required maxLength={40} />
        </div>
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor="category">Categoría</label>
          <input id="category" value={category} onChange={(e) => setCategory(e.target.value)} maxLength={60} />
        </div>
        <div className="field">
          <label htmlFor="stock">Stock actual</label>
          <input
            id="stock"
            type="number"
            min={0}
            step={1}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label htmlFor="cost">Precio costo</label>
          <input
            id="cost"
            type="number"
            min={0}
            step={0.01}
            value={costPrice}
            onChange={(e) => setCostPrice(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label htmlFor="sale">Precio venta</label>
          <input
            id="sale"
            type="number"
            min={0}
            step={0.01}
            value={salePrice}
            onChange={(e) => setSalePrice(Number(e.target.value))}
          />
        </div>
        <div className="row-actions">
          <button type="submit" className="btn btn--primary">
            Guardar
          </button>
          <Link to="/inventario" className="btn btn--ghost">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}
