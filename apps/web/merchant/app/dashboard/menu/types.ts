export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  status: string;
  image_url?: string;
  ingredients?: Array<{ product_id: number; quantity: number }>;
}

export interface MenuItemEdit {
  id: number;
  name: string;
  newPrice: number;
  originalPrice: number;
}

export interface PaginatedMenuResponse {
  menuItems: MenuItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EditMenuItemForm {
  name: string;
  description: string;
  price: number;
  category: string;
  status: string;
  image_url?: string;
}
