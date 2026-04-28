import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { demoSeed } from "../data/seed";
import type { Product, Purchase, Sale, LineItem } from "../types";

const STORAGE_KEY = "pymeapp-demo-v1";

type Stored = {
  products: Product[];
  sales: Sale[];
  purchases: Purchase[];
};

const empty: Stored = { products: [], sales: [], purchases: [] };

function load(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...empty };
    const p = JSON.parse(raw) as Partial<Stored>;
    return {
      products: Array.isArray(p.products) ? p.products : [],
      sales: Array.isArray(p.sales) ? p.sales : [],
      purchases: Array.isArray(p.purchases) ? p.purchases : [],
    };
  } catch {
    return { ...empty };
  }
}

function save(data: Stored) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

type AppContextValue = {
  products: Product[];
  sales: Sale[];
  purchases: Purchase[];
  upsertProduct: (p: Omit<Product, "id" | "updatedAt"> & { id?: string }) => void;
  deleteProduct: (id: string) => boolean;
  getProduct: (id: string) => Product | undefined;
  createSale: (customer: string, items: LineItem[]) => { ok: true; sale: Sale } | { ok: false; error: string };
  createPurchase: (supplier: string, items: LineItem[]) => { ok: true; purchase: Purchase } | { ok: false; error: string };
  resetDemo: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = load();
    const isEmpty = !data.products.length && !data.sales.length && !data.purchases.length;
    if (isEmpty) {
      setProducts(demoSeed.products);
      setSales(demoSeed.sales);
      setPurchases(demoSeed.purchases);
    } else {
      setProducts(data.products);
      setSales(data.sales);
      setPurchases(data.purchases);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    save({ products, sales, purchases });
  }, [hydrated, products, sales, purchases]);

  const upsertProduct = useCallback((input: Omit<Product, "id" | "updatedAt"> & { id?: string }) => {
    const now = new Date().toISOString();
    if (input.id) {
      setProducts((prev) =>
        prev.map((x) =>
          x.id === input.id
            ? {
                ...x,
                sku: input.sku,
                name: input.name,
                category: input.category,
                stock: input.stock,
                costPrice: input.costPrice,
                salePrice: input.salePrice,
                updatedAt: now,
              }
            : x
        )
      );
    } else {
      const p: Product = {
        id: uid(),
        sku: input.sku,
        name: input.name,
        category: input.category,
        stock: input.stock,
        costPrice: input.costPrice,
        salePrice: input.salePrice,
        updatedAt: now,
      };
      setProducts((prev) => [...prev, p]);
    }
  }, []);

  const deleteProduct = useCallback(
    (id: string) => {
      const inSale = sales.some((s) => s.items.some((i) => i.productId === id));
      const inPurchase = purchases.some((p) => p.items.some((i) => i.productId === id));
      if (inSale || inPurchase) return false;
      setProducts((prev) => prev.filter((x) => x.id !== id));
      return true;
    },
    [sales, purchases]
  );

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const createSale = useCallback(
    (customer: string, items: LineItem[]) => {
      if (!items.length) return { ok: false as const, error: "Agregue al menos una línea." };
      const byId = new Map(products.map((p) => [p.id, p]));
      for (const line of items) {
        const p = byId.get(line.productId);
        if (!p) return { ok: false as const, error: "Producto no encontrado." };
        if (line.qty <= 0) return { ok: false as const, error: "Cantidades deben ser mayores a cero." };
        if (line.qty > p.stock) return { ok: false as const, error: `Stock insuficiente: ${p.name}` };
      }
      const total = items.reduce((acc, l) => acc + l.qty * l.unitPrice, 0);
      const sale: Sale = {
        id: uid(),
        createdAt: new Date().toISOString(),
        customer: customer.trim() || "Mostrador",
        items,
        total,
      };
      setProducts((prev) =>
        prev.map((p) => {
          const sold = items.filter((i) => i.productId === p.id).reduce((a, i) => a + i.qty, 0);
          return sold ? { ...p, stock: p.stock - sold, updatedAt: sale.createdAt } : p;
        })
      );
      setSales((prev) => [sale, ...prev]);
      return { ok: true as const, sale };
    },
    [products]
  );

  const createPurchase = useCallback(
    (supplier: string, items: LineItem[]) => {
      if (!items.length) return { ok: false as const, error: "Agregue al menos una línea." };
      const byId = new Map(products.map((p) => [p.id, p]));
      for (const line of items) {
        if (!byId.has(line.productId)) return { ok: false as const, error: "Producto no encontrado." };
        if (line.qty <= 0) return { ok: false as const, error: "Cantidades deben ser mayores a cero." };
      }
      const total = items.reduce((acc, l) => acc + l.qty * l.unitPrice, 0);
      const purchase: Purchase = {
        id: uid(),
        createdAt: new Date().toISOString(),
        supplier: supplier.trim() || "Proveedor",
        items,
        total,
      };
      setProducts((prev) =>
        prev.map((p) => {
          const add = items.filter((i) => i.productId === p.id).reduce((a, i) => a + i.qty, 0);
          return add ? { ...p, stock: p.stock + add, updatedAt: purchase.createdAt } : p;
        })
      );
      setPurchases((prev) => [purchase, ...prev]);
      return { ok: true as const, purchase };
    },
    [products]
  );

  const resetDemo = useCallback(() => {
    setProducts(demoSeed.products);
    setSales(demoSeed.sales);
    setPurchases(demoSeed.purchases);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      products,
      sales,
      purchases,
      upsertProduct,
      deleteProduct,
      getProduct,
      createSale,
      createPurchase,
      resetDemo,
    }),
    [products, sales, purchases, upsertProduct, deleteProduct, getProduct, createSale, createPurchase, resetDemo]
  );

  if (!hydrated) {
    return (
      <div className="app-boot" aria-busy="true">
        <span className="app-boot__dot" />
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp dentro de AppProvider");
  return ctx;
}
