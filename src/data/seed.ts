import type { Product, Purchase, Sale } from "../types";

/** Stock final coherente con las compras y ventas de ejemplo. */
export const demoSeed: { products: Product[]; sales: Sale[]; purchases: Purchase[] } = {
  products: [
    {
      id: "seed-p1",
      sku: "SKU-001",
      name: "Cuaderno A4 100 hojas",
      category: "Papelería",
      stock: 130,
      costPrice: 2.5,
      salePrice: 4.9,
      updatedAt: "2026-04-25T14:00:00.000Z",
    },
    {
      id: "seed-p2",
      sku: "SKU-002",
      name: "Bolígrafo azul x12",
      category: "Papelería",
      stock: 62,
      costPrice: 3.2,
      salePrice: 6.5,
      updatedAt: "2026-04-25T14:00:00.000Z",
    },
    {
      id: "seed-p3",
      sku: "SKU-003",
      name: "Agua mineral 600ml",
      category: "Bebidas",
      stock: 248,
      costPrice: 0.35,
      salePrice: 0.85,
      updatedAt: "2026-04-25T14:00:00.000Z",
    },
  ],
  purchases: [
    {
      id: "seed-pu2",
      createdAt: "2026-04-23T11:15:00.000Z",
      supplier: "Agua Pura del Valle",
      items: [{ productId: "seed-p3", qty: 100, unitPrice: 0.35 }],
      total: 100 * 0.35,
    },
    {
      id: "seed-pu1",
      createdAt: "2026-04-22T09:30:00.000Z",
      supplier: "Distribuidora Norte S.A.",
      items: [
        { productId: "seed-p1", qty: 40, unitPrice: 2.5 },
        { productId: "seed-p2", qty: 30, unitPrice: 3.2 },
      ],
      total: 40 * 2.5 + 30 * 3.2,
    },
  ],
  sales: [
    {
      id: "seed-s1",
      createdAt: "2026-04-27T10:20:00.000Z",
      customer: "María López — Librería Centro",
      items: [
        { productId: "seed-p1", qty: 20, unitPrice: 4.9 },
        { productId: "seed-p3", qty: 12, unitPrice: 0.85 },
      ],
      total: 20 * 4.9 + 12 * 0.85,
    },
    {
      id: "seed-s2",
      createdAt: "2026-04-26T16:45:00.000Z",
      customer: "Mostrador",
      items: [
        { productId: "seed-p2", qty: 8, unitPrice: 6.5 },
        { productId: "seed-p3", qty: 15, unitPrice: 0.85 },
      ],
      total: 8 * 6.5 + 15 * 0.85,
    },
    {
      id: "seed-s3",
      createdAt: "2026-04-25T14:00:00.000Z",
      customer: "Colegio San Martín",
      items: [
        { productId: "seed-p1", qty: 10, unitPrice: 4.9 },
        { productId: "seed-p2", qty: 5, unitPrice: 6.5 },
      ],
      total: 10 * 4.9 + 5 * 6.5,
    },
    {
      id: "seed-s4",
      createdAt: "2026-04-24T12:10:00.000Z",
      customer: "Kiosco 12 de Octubre",
      items: [{ productId: "seed-p3", qty: 25, unitPrice: 0.85 }],
      total: 25 * 0.85,
    },
  ],
};
