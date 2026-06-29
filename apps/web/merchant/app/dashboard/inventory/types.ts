export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  cost: number;
  wholesale_price: number;
  wholesale_count: number;
  low_stock_threshold: number;
  category: { id: number; name: string } | null;
  stock: number;
  status: string;
}

export interface ProductEdit {
  id: number;
  name: string;
  newStock: number;
  originalStock: number;
}

export interface PaginatedResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EditProductForm {
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  wholesale_price: number;
  wholesale_count: number;
  low_stock_threshold: number;
  status: string;
}

export type InventoryAdjustmentReason =
  | 'SALE'
  | 'RESTOCK'
  | 'DAMAGED'
  | 'EXPIRED'
  | 'LOST'
  | 'ADJUSTMENT';
