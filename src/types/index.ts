export interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  promotional_price?: number | null;
  stock: number;
  availability: string;
  description: string;
  dimensions?: string;
  color_variants?: string;
  material_finish?: string;
  key_features?: string[] | string;
  image_url: string;
  is_featured: number;
  is_published: number;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

export interface CartItem {
  id: number;
  code: string;
  name: string;
  price: number;
  promotional_price?: number | null;
  image_url: string;
  stock: number;
  quantity: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_code: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderHistoryEvent {
  id: number;
  order_id: number;
  status: string;
  notes?: string;
  updated_by?: string;
  created_at: string;
}

export interface Order {
  id: number;
  order_ref: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  notes?: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  tracking_number?: string;
  created_at: string;
  items?: OrderItem[];
  history?: OrderHistoryEvent[];
}

export interface Quotation {
  id: number;
  quote_ref: string;
  product_id?: number;
  product_name?: string;
  quantity: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  message: string;
  status: string;
  proposed_price?: number;
  admin_notes?: string;
  created_at: string;
}

export interface Enquiry {
  id: number;
  name: string;
  phone: string;
  email?: string;
  company_name?: string;
  city?: string;
  enquiry_type?: string;
  product_of_interest?: string;
  subject?: string;
  message: string;
  status: string;
  admin_notes?: string;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
}

export interface Partner {
  id: number;
  name: string;
  category: string;
  website?: string;
  description?: string;
  logo_url?: string;
  status: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  location?: string;
  description: string;
  image_url: string;
  products_used?: string;
}
