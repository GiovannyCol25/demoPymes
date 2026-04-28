import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { money } from "../../lib/format";

export function InventarioList() {
  const { products, deleteProduct } = useApp();

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Inventario</h1>
          <p>Consulte productos, stock y precios. Use «Nuevo» para dar de alta o edite desde la tabla.</p>
        </div>
        <Link to="/inventario/nuevo" className="btn btn--primary">
          Nuevo producto
        </Link>
      </header>

      <div className="card">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Costo</th>
                <th>P. venta</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="mono">{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>
                    <span className={p.stock < 15 ? "badge badge--low" : "badge badge--ok"}>{p.stock}</span>
                  </td>
                  <td className="mono">{money(p.costPrice)}</td>
                  <td className="mono">{money(p.salePrice)}</td>
                  <td>
                    <div className="row-actions">
                      <Link to={`/inventario/${p.id}`} className="btn btn--ghost" style={{ padding: "0.35rem 0.6rem" }}>
                        Editar
                      </Link>
                      <button
                        type="button"
                        className="btn btn--danger"
                        style={{ padding: "0.35rem 0.6rem" }}
                        onClick={() => {
                          const ok = deleteProduct(p.id);
                          if (!ok) alert("No se puede eliminar: figura en ventas o compras.");
                        }}
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!products.length ? <p className="stack-muted">No hay productos. Cree uno nuevo.</p> : null}
      </div>
    </>
  );
}
