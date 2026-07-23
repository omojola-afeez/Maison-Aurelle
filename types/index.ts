export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDesc?: string | null;
  price: number;
  comparePrice?: number | null;
  sku: string;
  barcode?: string | null;
  weight?: number | null;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED" | "OUT_OF_STOCK";
  featured: boolean;
  taxClass: string;
  metaTitle?: string | null;
  metaDesc?: string | null;
  metaKeywords?: string | null;
  categoryId?: string | null;
  designerId?: string | null;
  category?: Category | null;
  designer?: Designer | null;
  variants: ProductVariant[];
  images: ProductImage[];
  collections: ProductCollection[];
  tags: ProductTag[];
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  sku: string;
  barcode?: string | null;
  price?: number | null;
  inventory: number;
  weight?: number | null;
  productId: string;
  options: VariantOption[];
}

export interface VariantOption {
  id: string;
  name: string;
  value: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  position: number;
  isPrimary: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  children?: Category[];
  products?: Product[];
}

export interface Designer {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  logo?: string | null;
  country?: string | null;
  founded?: number | null;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  featured: boolean;
  sortOrder: number;
}

export interface ProductCollection {
  productId: string;
  collectionId: string;
  sortOrder: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ProductTag {
  productId: string;
  tagId: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  variantId: string;
  variant: ProductVariant & {
    product: Pick<Product, "id" | "name" | "slug" | "images">;
  };
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Pick<Product, "id" | "name" | "slug" | "price" | "comparePrice" | "images">;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  subtotal: number;
  taxTotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  currency: string;
  email: string;
  phone?: string | null;
  notes?: string | null;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  trackingNumber?: string | null;
  carrier?: string | null;
  shippedAt?: Date | null;
  deliveredAt?: Date | null;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  total: number;
  productName: string;
  variantName?: string | null;
  sku: string;
  image?: string | null;
}

export interface Review {
  id: string;
  rating: number;
  title?: string | null;
  content: string;
  isVerified: boolean;
  helpful: number;
  status: string;
  userId: string;
  user: {
    name: string | null;
    image: string | null;
  };
  productId: string;
  createdAt: Date;
}

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  type: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  image?: string | null;
  role: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  startsAt: Date;
  expiresAt?: Date | null;
  isActive: boolean;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: unknown;
  createdAt: Date;
}

export interface FilterState {
  category?: string;
  designer?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  material?: string;
  sortBy?: string;
}

export interface ShippingRate {
  id: string;
  carrier: string;
  service: string;
  rate: number;
  currency: string;
  estimatedDays: number;
  estimatedDelivery: string;
}
