export class CreateMenuItemDto {
  name: string;
  description?: string;
  price: number;
  category?: string;
  status?: string;
  image_url?: string;
  ingredients?: Array<{ product_id: number; quantity: number }>;
}
