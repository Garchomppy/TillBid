import { useSyncExternalStore } from 'react';

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
    // Additional fields from mock data to support the UI if needed
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
    // UI fields
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

class Store {
    private state: AppState = {
        currentUser: null,
        products: [],
        transactions: [],
        notifications: []
    };

    private listeners: (() => void)[] = [];

    constructor() {
        this.loadInitialData();
    }

    private loadInitialData() {
        const saved = localStorage.getItem('tillbid_state_v4');
        if (saved) {
            this.state = JSON.parse(saved);
        } else {
            // Updated Mock Data from app.js
            this.state = {
                currentUser: {
                    id: 'u1',
                    name: 'Kien Nguyen',
                    email: 'kien@example.com',
                    balance: 2500000,
                    frozenBalance: 500000,
                    isVerified: true,
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kien',
                    productsWon: [],
                    productsSelling: []
                },
                products: [
                    {
                        id: 'p11',
                        name: "Máy ảnh Leica M6 Classic Silver",
                        category: "Công nghệ",
                        condition: "Gần như mới",
                        currentPrice: 85000000,
                        startPrice: 75000000,
                        sellerId: "Đức Hiếu",
                        image: "/images/leica-m6.png",
                        images: ["/images/leica-m6.png"],
                        endTime: Date.now() + 3600 * 500,
                        status: 'active',
                        highestBidderId: null,
                        watchlistCount: 124,
                        description: "Leica M6 Classic bản Silver cực hiếm. Máy hoạt động hoàn hảo, đo sáng chuẩn, view sáng rõ. Kèm bao da và dây đeo zin. Tuyệt phẩm cho người sưu tầm.",
                        badge: "hot"
                    },
                    {
                        id: 'p1',
                        name: "Áo Zara Linen Trắng Size M",
                        category: "Thời trang",
                        condition: "Như mới",
                        currentPrice: 350000,
                        startPrice: 200000,
                        sellerId: "Minh Châu",
                        image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=400&q=80",
                        images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=400&q=80"],
                        endTime: Date.now() + 7200 * 1000,
                        status: 'active',
                        watchlistCount: 12,
                        description: "Áo Zara linen trắng mua tại Hà Nội, mặc 2 lần. Không có lỗi, còn tag. Giặt khô trước khi giao.",
                        tags: ["Thời trang", "Như mới"],
                        badge: "hot",
                        highestBidderId: 'u2'
                    },
                    {
                        id: 'p2',
                        name: "iPhone 13 Pro 256GB Xanh Sierra",
                        category: "Công nghệ",
                        condition: "Tốt",
                        currentPrice: 14500000,
                        startPrice: 12000000,
                        sellerId: "Hà Linh",
                        image: "/images/iphone-13-pro.png",
                        images: ["/images/iphone-13-pro.png"],
                        endTime: Date.now() + 3600 * 1000,
                        status: 'active',
                        watchlistCount: 28,
                        description: "iPhone 13 Pro mua 12/2021. Pin 87%, không trầy xước. Có hộp, cáp zin. Lỗi nhỏ: loa ngoài đôi khi rè nhẹ.",
                        tags: ["Công nghệ", "Tốt"],
                        badge: "ending",
                        highestBidderId: 'u3'
                    },
                    {
                        id: 'p3',
                        name: "Túi Coach Tabby 26 Màu Kem",
                        category: "Túi xách",
                        condition: "Như mới",
                        currentPrice: 3200000,
                        startPrice: 2500000,
                        sellerId: "Thu Hà",
                        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
                        images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80"],
                        endTime: Date.now() + 43200 * 1000,
                        status: 'active',
                        watchlistCount: 19,
                        description: "Túi Coach Tabby 26 mua tại Singapore. Dùng 3 lần, còn dustbag và thẻ. Không có lỗi.",
                        tags: ["Túi xách", "Như mới"],
                        badge: "hot",
                        highestBidderId: 'u4'
                    },
                    {
                        id: 'p4',
                        name: "Son MAC Ruby Woo + Liner",
                        category: "Mỹ phẩm",
                        condition: "Như mới",
                        currentPrice: 280000,
                        startPrice: 150000,
                        sellerId: "Lan Anh",
                        image: "https://images.unsplash.com/photo-1586495777744-4e6232bf2f9b?w=400&q=80",
                        images: ["https://images.unsplash.com/photo-1586495777744-4e6232bf2f9b?w=400&q=80"],
                        endTime: Date.now() + 86400 * 1000,
                        status: 'active',
                        watchlistCount: 7,
                        description: "Son MAC Ruby Woo dùng 2 lần, còn 95%. Kèm liner MAC chưa dùng. Đã vệ sinh sạch.",
                        tags: ["Mỹ phẩm", "Như mới"],
                        badge: "new",
                        highestBidderId: 'u5'
                    },
                    {
                        id: 'p5',
                        name: "Giày Nike Air Force 1 Size 38",
                        category: "Giày dép",
                        condition: "Tốt",
                        currentPrice: 950000,
                        startPrice: 700000,
                        sellerId: "Tuấn Kiệt",
                        image: "/images/nike-af1.png",
                        images: ["/images/nike-af1.png"],
                        endTime: Date.now() + 14400 * 1000,
                        status: 'active',
                        watchlistCount: 15,
                        description: "Nike AF1 mua tại Foot Locker. Đi khoảng 10 lần. Đế còn tốt, có vài vết bẩn nhỏ đã vệ sinh.",
                        tags: ["Giày dép", "Tốt"],
                        badge: "hot",
                        highestBidderId: 'u6'
                    },
                    {
                        id: 'p6',
                        name: "MacBook Air M2 8/256GB Midnight",
                        category: "Công nghệ",
                        condition: "Như mới",
                        currentPrice: 18500000,
                        startPrice: 15000000,
                        sellerId: "Quốc Anh",
                        image: "/images/macbook-pro.png",
                        images: ["/images/macbook-pro.png"],
                        endTime: Date.now() + 172800 * 1000,
                        status: 'active',
                        highestBidderId: null,
                        watchlistCount: 42,
                        description: "MacBook Air M2 màu Midnight đẹp không tì vết. Sạc mới 15 lần. Bảo hành chính hãng 6 tháng.",
                        badge: "hot"
                    },
                    {
                        id: 'p7',
                        name: "Túi Louis Vuitton Neverfull MM",
                        category: "Túi xách",
                        condition: "Tốt",
                        currentPrice: 22000000,
                        startPrice: 15000000,
                        sellerId: "Ngọc Trinh",
                        image: "/images/lv-neverfull.png",
                        images: ["/images/lv-neverfull.png"],
                        endTime: Date.now() + 5400 * 1000,
                        status: 'active',
                        highestBidderId: null,
                        watchlistCount: 56,
                        description: "Túi LV Neverfull chính hãng, có hóa đơn. Da có chút ngả màu tự nhiên của dòng Monogram. İç sạch sẽ.",
                        badge: "ending"
                    },
                    {
                        id: 'p8',
                        name: "Giày Adidas Samba OG Cloud White",
                        category: "Giày dép",
                        condition: "Thương hiệu mới",
                        currentPrice: 2800000,
                        startPrice: 2200000,
                        sellerId: "Minh Tú",
                        image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&q=80",
                        images: ["https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&q=80"],
                        endTime: Date.now() + 259200 * 1000,
                        status: 'active',
                        highestBidderId: null,
                        watchlistCount: 89,
                        description: "Adidas Samba OG Size 40. Full box, chưa xỏ chân. Mua tại store Nhật.",
                        badge: "new"
                    },
                    {
                        id: 'p9',
                        name: "Nước hoa Chanel Bleu de Chanel EDP",
                        category: "Mỹ phẩm",
                        condition: "Tốt",
                        currentPrice: 1900000,
                        startPrice: 1000000,
                        sellerId: "Hoàng Nam",
                        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80",
                        images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80"],
                        endTime: Date.now() + 21600 * 1000,
                        status: 'active',
                        highestBidderId: null,
                        watchlistCount: 14,
                        description: "Chanel Bleu EDP 100ml còn khoảng 85ml. Cam kết 100% original. Mùi hương nam tính quyến rũ."
                    },
                    {
                        id: 'p10',
                        name: "Váy lụa thiết kế màu Champagne",
                        category: "Thời trang",
                        condition: "Như mới",
                        currentPrice: 850000,
                        startPrice: 500000,
                        sellerId: "Hương Giang",
                        image: "https://images.unsplash.com/photo-1539109132382-381bb3f51fc3?w=400&q=80",
                        images: ["https://images.unsplash.com/photo-1539109132382-381bb3f51fc3?w=400&q=80"],
                        endTime: Date.now() + 129600 * 1000,
                        status: 'active',
                        highestBidderId: null,
                        watchlistCount: 22,
                        description: "Váy lụa bóng thiết kế cao cấp, mặc chụp ảnh 1 lần. Size S (45-50kg) cực tôn dáng."
                    }
                ],
                transactions: [
                    { id: 't1', productId: 'p1', buyerId: 'u2', sellerId: 'u1', amount: 350000, status: 'disbursed', timestamp: Date.now(), title: 'Nhận tiền – Áo Zara', icon: '✅' },
                    { id: 't2', productId: 'p3', buyerId: 'u1', sellerId: 'u4', amount: 500000, status: 'frozen', timestamp: Date.now(), title: 'Đặt cọc – Túi Coach', icon: '🔒' },
                    { id: 't3', productId: 'p2', buyerId: 'u1', sellerId: 'u3', amount: 200000, status: 'disbursed', timestamp: Date.now(), title: 'Hoàn cọc – iPhone 12', icon: '🔄' }
                ],
                notifications: []
            };
            this.save();
        }
    }

    private save() {
        localStorage.setItem('tillbid_state_v4', JSON.stringify(this.state));
        this.notify();
    }

    private notify() {
        this.listeners.forEach(l => l());
    }

    subscribe = (listener: () => void) => {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    getState = () => {
        return this.state;
    }

    // Actions (Using immutable updates to ensure reference stability and trigger React renders)
    verifyUser() {
        if (this.state.currentUser) {
            this.state = {
                ...this.state,
                currentUser: { ...this.state.currentUser, isVerified: true }
            };
            this.addNotification('Account verified successfully!', 'success');
            this.save();
        }
    }

    logout() {
        this.state = {
            ...this.state,
            currentUser: null
        };
        this.addNotification('Logged out successfully.', 'info');
        this.save();
    }

    login(email: string, _pass: string) {
        // Mock logic: allow any login for demo, but use kien@example.com for the profile
        const user: User = {
            id: 'u1',
            name: email === 'kien@example.com' ? 'Kien Nguyen' : email.split('@')[0],
            email: email,
            balance: 2500000,
            frozenBalance: 500000,
            isVerified: true,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            productsWon: [],
            productsSelling: []
        };
        
        this.state = {
            ...this.state,
            currentUser: user
        };
        this.save();
        return true;
    }

    register(name: string, email: string) {
        const user: User = {
            id: 'u' + Math.random().toString(36).substr(2, 9),
            name: name,
            email: email,
            balance: 1000000, // Starting balance for new users
            frozenBalance: 0,
            isVerified: false,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            productsWon: [],
            productsSelling: []
        };

        this.state = {
            ...this.state,
            currentUser: user
        };
        this.save();
        return true;
    }

    placeBid(productId: string, amount: number) {
        const user = this.state.currentUser;
        if (!user) return;

        if (user.balance < amount) {
            this.addNotification('Insufficient balance in wallet', 'warning');
            return;
        }

        const productIndex = this.state.products.findIndex(p => p.id === productId);
        if (productIndex === -1) return;
        
        const product = this.state.products[productIndex];
        if (amount <= product.currentPrice) {
            this.addNotification('Bid must be higher than current price', 'warning');
            return;
        }

        const newProducts = [...this.state.products];
        newProducts[productIndex] = {
            ...product,
            currentPrice: amount,
            highestBidderId: user.id
        };

        this.state = {
            ...this.state,
            products: newProducts
        };

        this.addNotification(`You are now the highest bidder for ${product.name}!`, 'success');
        this.save();
    }

    finalizeAuction(productId: string) {
        const productIndex = this.state.products.findIndex(p => p.id === productId);
        if (productIndex === -1) return;
        
        const product = this.state.products[productIndex];
        if (product.status !== 'active') return;

        const newProducts = [...this.state.products];
        newProducts[productIndex] = { ...product, status: 'ended' };
        
        let newState = { ...this.state, products: newProducts };

        if (product.highestBidderId === this.state.currentUser?.id) {
            const user = { ...this.state.currentUser };
            user.balance -= product.currentPrice;
            user.frozenBalance += product.currentPrice;
            
            const newTransactions = [
                ...this.state.transactions,
                {
                    id: 't' + Math.random().toString(36).substr(2, 9),
                    productId: product.id,
                    buyerId: user.id,
                    sellerId: product.sellerId,
                    amount: product.currentPrice,
                    status: 'frozen' as const,
                    timestamp: Date.now(),
                    title: `Đặt cọc – ${product.name}`,
                    icon: '🔒'
                }
            ];

            newState = { ...newState, currentUser: user, transactions: newTransactions };
            this.addNotification(`Congratulations! You won the auction for ${product.name}!`, 'success');
        }

        this.state = newState;
        this.save();
    }

    confirmReceipt(transactionId: string) {
        const txIndex = this.state.transactions.findIndex(t => t.id === transactionId);
        if (txIndex === -1) return;
        
        const tx = this.state.transactions[txIndex];
        if (tx.status !== 'frozen') return;

        const newTransactions = [...this.state.transactions];
        newTransactions[txIndex] = { ...tx, status: 'disbursed' };
        
        let newState = { ...this.state, transactions: newTransactions };

        if (this.state.currentUser?.id === tx.buyerId) {
            const user = { ...this.state.currentUser };
            user.frozenBalance -= tx.amount;
            
            // In a real app we'd add it to the seller, here we simulate if buyer confirms
            newState = { ...newState, currentUser: user };
            this.addNotification('Funds released. Thank you!', 'success');
        }

        this.state = newState;
        this.save();
    }

    postProduct(data: { name: string, description: string, category: string, startPrice: number, durationHours: number }) {
        if (!this.state.currentUser) return;

        const newProduct: Product = {
            id: 'p' + Math.random().toString(36).substr(2, 9),
            name: data.name,
            description: data.description,
            category: data.category,
            sellerId: this.state.currentUser.id,
            image: `https://placehold.co/600x400/1e293b/white?text=${encodeURIComponent(data.name)}`,
            images: [],
            startPrice: data.startPrice,
            currentPrice: data.startPrice,
            highestBidderId: null,
            endTime: Date.now() + 1000 * 60 * 60 * data.durationHours,
            status: 'active',
            watchlistCount: 0,
            condition: 'Brand New',
        };

        this.state = {
            ...this.state,
            products: [newProduct, ...this.state.products]
        };

        this.addNotification('Product posted successfully!', 'success');
        this.save();
        return newProduct.id;
    }

    addNotification(message: string, type: 'info' | 'success' | 'warning' = 'info') {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotifications = [
            { id, message, type, timestamp: Date.now() },
            ...this.state.notifications
        ];

        this.state = { ...this.state, notifications: newNotifications };
        this.save();
        
        setTimeout(() => {
            this.removeNotification(id);
        }, 5000);
    }

    removeNotification(id: string) {
        this.state = {
            ...this.state,
            notifications: this.state.notifications.filter(n => n.id !== id)
        };
        this.save();
    }

    // Live Simulation Logic
    simulateLiveActivity() {
        const randomAction = Math.random();
        const products = this.state.products.filter(p => p.status === 'active');
        if (products.length === 0) return;

        const product = products[Math.floor(Math.random() * products.length)];

        if (randomAction > 0.7) {
            // Other user bids
            const increment = Math.floor(Math.random() * 5) * 50000 + 50000;
            const newPrice = product.currentPrice + increment;
            const mockUser = ['Hồng Quân', 'Thanh Thảo', 'Minh Nhật', 'Gia Bảo', 'Quỳnh Anh'][Math.floor(Math.random() * 5)];
            
            const productIndex = this.state.products.findIndex(p => p.id === product.id);
            const newProducts = [...this.state.products];
            newProducts[productIndex] = {
                ...product,
                currentPrice: newPrice,
                highestBidderId: 'mock_' + mockUser
            };

            this.state = { ...this.state, products: newProducts };
            this.addNotification(`${mockUser} vừa đặt thầu cho ${product.name}!`, 'info');
            this.save();
        } else if (randomAction > 0.4) {
            // Watchlist update
            const productIndex = this.state.products.findIndex(p => p.id === product.id);
            const newProducts = [...this.state.products];
            newProducts[productIndex] = {
                ...product,
                watchlistCount: product.watchlistCount + 1
            };
            this.state = { ...this.state, products: newProducts };
            this.save();
        }
    }

    startSimulation() {
        setInterval(() => this.simulateLiveActivity(), 15000 + Math.random() * 10000);
    }
}

export const store = new Store();
// Auto-start simulation for demo feel
store.startSimulation();

export function useStore() {
    return useSyncExternalStore(store.subscribe, store.getState);
}
