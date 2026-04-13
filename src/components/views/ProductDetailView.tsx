import React, { useState, useEffect } from 'react';
import { store, useStore } from '../../store';
import { router } from '../../router';

interface ProductDetailProps {
    id?: string;
}

export const ProductDetailView: React.FC<ProductDetailProps> = ({ id }) => {
    const { products } = useStore();
    const { placeBid } = store;
    const [bidAmount, setBidAmount] = useState<number>(0);
    const product = products.find(p => p.id === id);

    const [timeLeft, setTimeLeft] = useState(
        product ? Math.max(0, Math.floor((product.endTime - Date.now()) / 1000)) : 0
    );

    useEffect(() => {
        if (product) {
            setBidAmount(product.currentPrice + 50000);
            setTimeLeft(Math.max(0, Math.floor((product.endTime - Date.now()) / 1000)));
        }
    }, [product]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!product) {
        return (
            <div className="max-w-6xl mx-auto py-32 text-center h-screen flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-black text-text-main">Sản phẩm không tồn tại</h2>
                <button onClick={() => router.navigate('home')} className="btn-primary mt-8 px-10">Quay lại trang chủ</button>
            </div>
        );
    }

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleBid = () => {
        if (bidAmount > product.currentPrice) {
            placeBid(product.id, bidAmount);
        } else {
            store.addNotification('Giá thầu phải cao hơn giá hiện tại!', 'warning');
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-32 px-4 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => router.navigate('home')} className="group text-text-muted font-black text-xs uppercase tracking-widest mb-12 flex items-center gap-2 hover:text-primary transition-all">
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Quay lại
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Images */}
                <div className="space-y-6">
                    <div className="relative group overflow-hidden rounded-[40px] border border-border-main bg-white shadow-2xl">
                        <img src={product.image} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                            {product.badge && (
                                <div className="bg-primary text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
                                    {product.badge}
                                e</div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                        {product.images.map((img, i) => (
                            <div key={i} className="min-w-[120px] aspect-square rounded-3xl overflow-hidden border-2 border-border-main hover:border-primary cursor-pointer transition-all bg-white p-1">
                                <img src={img} className="w-full h-full object-cover rounded-2xl" alt={`View ${i}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-10">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary/10">
                                {product.category}
                            </span>
                            <span className="bg-background text-text-muted text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-border-main">
                                {product.condition}
                            </span>
                        </div>
                        <h1 className="text-5xl font-black text-text-main mb-6 leading-[1.1]">{product.name}</h1>
                        <p className="text-text-muted font-medium text-lg leading-relaxed">{product.description}</p>
                    </div>

                    <div className="glass-card p-8 flex items-center gap-6 bg-gradient-to-br from-white to-primary/5 hover:border-primary/20 transition-all group">
                        <div className="relative">
                            <img 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerId}`} 
                                className="w-16 h-16 rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform" 
                            />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white shadow-sm" />
                        </div>
                        <div className="flex-1">
                            <div className="font-black text-text-main text-xl flex items-center gap-2">
                                {product.sellerId}
                                <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
                                </svg>
                            </div>
                            <div className="text-sm font-bold text-text-muted flex items-center gap-1.5 mt-1">
                                <svg className="w-3.5 h-3.5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                4.98 · <span className="text-text-main">312 sales</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => router.navigate('shop', { id: product.sellerId })}
                            className="bg-white hover:bg-background border border-border-main px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm"
                        >
                            Xem shop
                        </button>
                    </div>

                    <div className="bg-text-main rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
                        
                        <div className="grid grid-cols-2 gap-10 mb-10 border-b border-white/10 pb-10">
                            <div>
                                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] block mb-3">Giá hiện tại</span>
                                <div className="text-5xl font-black text-primary tracking-tighter">{product.currentPrice.toLocaleString()}đ</div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] block mb-3">Kết thúc sau</span>
                                <div className={`text-3xl font-black ${timeLeft < 3600 ? 'text-rose-500 animate-pulse' : 'text-secondary'}`}>
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 font-bold">đ</div>
                                    <input 
                                        type="number"
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(Number(e.target.value))}
                                        className="w-full bg-white/10 border border-white/20 rounded-[24px] pl-12 pr-6 py-5 font-black text-2xl outline-none focus:border-primary focus:bg-white/20 transition-all text-white"
                                    />
                                </div>
                                <button 
                                    onClick={handleBid}
                                    className="btn-primary !px-12 !py-5 text-lg group"
                                >
                                    Đặt giá
                                    <svg className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-3 bg-white/5 py-3 rounded-2xl border border-white/5">
                                <svg className="w-4 h-4 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="text-[11px] font-black text-white/60 uppercase tracking-widest leading-none">Ví trung gian bảo vệ 100%</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white border border-border-main px-8 py-5 rounded-3xl flex-1 text-center shadow-sm hover:shadow-md transition-all">
                            <div className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Đang theo dõi</div>
                            <div className="text-xl font-black text-primary">{product.watchlistCount} người</div>
                        </div>
                        <div className="bg-white border border-border-main px-8 py-5 rounded-3xl flex-1 text-center shadow-sm hover:shadow-md transition-all">
                            <div className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Phí vận chuyển</div>
                            <div className="text-xl font-black text-secondary">Miễn phí</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
