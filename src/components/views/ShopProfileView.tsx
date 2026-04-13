import React from 'react';
import { useStore } from '../../store';
import { ProductCard } from '../ProductCard';

interface ShopProfileProps {
    sellerId: string;
}

export const ShopProfileView: React.FC<ShopProfileProps> = ({ sellerId }) => {
    const { products } = useStore();
    const sellerProducts = products.filter(p => p.sellerId === sellerId);

    return (
        <div className="max-w-7xl mx-auto py-32 px-4 h-full">
            <div className="glass-card p-10 mb-12 flex flex-col md:flex-row gap-10 items-center bg-gradient-to-br from-white to-primary/5">
                <div className="relative group shrink-0">
                    <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sellerId}`} 
                        className="w-40 h-40 rounded-full border-4 border-white shadow-2xl p-1 bg-white group-hover:scale-105 transition-all duration-500" 
                    />
                    <div className="absolute bottom-4 right-4 bg-green-500 w-8 h-8 rounded-full border-4 border-white shadow-lg animate-pulse" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                        <h2 className="text-4xl font-black text-text-main">{sellerId}</h2>
                        <div className="bg-secondary/10 text-secondary text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-secondary/20 flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
                            </svg>
                            Verified Artist
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-8 mb-8 justify-center md:justify-start">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-background border border-border-main flex items-center justify-center text-primary">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] leading-none mb-1">Tham gia</div>
                                <div className="text-sm font-black text-text-main">01/2023</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-background border border-border-main flex items-center justify-center text-secondary">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] leading-none mb-1">Đánh giá</div>
                                <div className="text-sm font-black text-text-main">4.98 (312 sales)</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="bg-white border border-border-main text-text-muted px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:border-primary/40 hover:text-text-main transition-colors select-none">⚡ Phản hồi nhanh</span>
                        <span className="bg-white border border-border-main text-text-muted px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:border-primary/40 hover:text-text-main transition-colors select-none">🏆 Top Seller</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="btn-primary !px-10">Theo dõi</button>
                    <button className="bg-white hover:bg-background h-14 w-14 rounded-2xl border border-border-main shadow-sm flex items-center justify-center transition-all group shrink-0">
                        <svg className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 100-2.684m0 2.684l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.315a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex gap-4 mb-12 overflow-x-auto no-scrollbar py-2">
                <button className="bg-text-main text-white px-8 py-3 rounded-2xl font-black text-[13px] tracking-tight shadow-xl flex items-center gap-2">
                    Đang bán ({sellerProducts.length})
                </button>
                <button className="bg-white border border-border-main text-text-muted px-8 py-3 rounded-2xl font-black text-[13px] tracking-tight hover:border-primary/40 transition-all">
                    Đã bán (142)
                </button>
                <button className="bg-white border border-border-main text-text-muted px-8 py-3 rounded-2xl font-black text-[13px] tracking-tight hover:border-primary/40 transition-all">
                    Đánh giá (56)
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {sellerProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};
