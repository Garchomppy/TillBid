import React from 'react';
import { useStore } from '../hooks/useStore';
import { ProductCard } from '../components/ProductCard';

export const FlashAuctionView: React.FC = () => {
    const { products } = useStore();
    const flashProducts = products.filter(p => p.badge === 'ending' || p.watchlistCount > 20);

    return (
        <div className="max-w-7xl mx-auto py-32 px-4 h-full">
            <div className="flex flex-col md:flex-row items-baseline gap-6 mb-12">
                <h2 className="text-4xl font-black italic text-text-main flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-primary italic">FLASH</span> AUCTION
                </h2>
                <div className="bg-text-main px-6 py-3 rounded-[24px] font-black text-primary flex items-center gap-4 shadow-xl border-t border-white/10 shrink-0">
                    <span className="text-[10px] text-white/60 uppercase font-black tracking-[0.2em]">Phiên kết thúc sau:</span>
                    <span className="text-2xl tracking-tighter">00:14:59</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {flashProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className="mt-20 bg-white/40 border border-border-main p-12 rounded-[40px] text-center backdrop-blur-xl group">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-black mb-4 text-text-main">Chiến trường đang nóng dần!</h3>
                <p className="text-text-muted text-[15px] max-w-lg mx-auto font-medium leading-relaxed">
                    Các sản phẩm Flash Auction có tốc độ tăng giá trung bình cao hơn <span className="text-primary font-black">300%</span> so với thông thường. Đừng bỏ lỡ cơ hội sở hữu món đồ hiệu mơ ước với giá hời nhất.
                </p>
            </div>
        </div>
    );
};
