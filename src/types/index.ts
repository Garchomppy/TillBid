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
    condition: string;
    images: string[];
    tags?: string[];
    badge?: string;
}

export interface Transaction {
    id: string;
    productId: string;
    buyerId: string;
    sellerId: string;
    amount: number;
    status: 'frozen' | 'disbursed';
    timestamp: number;
    title?: string;
    icon?: string;
}

export interface Notification {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning';
    timestamp: number;
}

export interface AppState {
    currentUser: User | null;
    products: Product[];
    transactions: Transaction[];
    notifications: Notification[];
}
