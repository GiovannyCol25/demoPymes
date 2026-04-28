export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  costPrice: number;
  salePrice: number;
  updatedAt: string;
};

export type LineItem = {
  productId: string;
  qty: number;
  unitPrice: number;
};

export type Sale = {
  id: string;
  createdAt: string;
  customer: string;
  items: LineItem[];
  total: number;
};

export type Purchase = {
  id: string;
  createdAt: string;
  supplier: string;
  items: LineItem[];
  total: number;
};
