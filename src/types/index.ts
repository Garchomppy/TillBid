export type View =
  | "home"
  | "product"
  | "post"
  | "profile"
  | "live"
  | "flash"
  | "shop"
  | "login";

export interface RouterState {
  view: View;
  params: Record<string, string>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  frozenBalance: number;
  isVerified: boolean;
  avatar: string;
  productsWon: string[];
  productsSelling: string[];
  hasAgreedToLivePolicy?: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    sellerId: string;
    image: string;
    category: string;
    startPrice: number;
    currentPrice: number;
    highestBidderId: string | null;
    endTime: number; // Precision: ms timestamp
    status: 'active' | 'ended' | 'disbursed';
    watchlistCount: number;
    isLive?: boolean;
    paymentDeadline?: number;
    paymentStatus?: 'pending' | 'paid' | 'penalized';
    condition: string;
    images: string[];
    tags?: string[];
    badge?: string;
    specs?: {
        size?: string;
        color?: string;
        material?: string;
        measurements?: string;
        defects?: string;
        brand?: string;
    };
    detailedDescription?: string;
}

export interface Transaction {
    id: string;
    productId: string;
    buyerId: string;
    sellerId: string;
    amount: number;
    status: 'pending_payment' | 'frozen' | 'disbursed';
    timestamp: number;
    title?: string;
    icon?: string;
    shippingInfo?: any;
}

export interface Notification {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning';
    timestamp: number;
}

export interface SellerReview {
    id: string;
    sellerId: string;
    buyerId: string;
    buyerName: string;
    rating: number;
    comment: string;
    timestamp: number;
}

export interface AppState {
    currentUser: User | null;
    products: Product[];
    transactions: Transaction[];
    notifications: Notification[];
    sellerReviews: SellerReview[];
}
