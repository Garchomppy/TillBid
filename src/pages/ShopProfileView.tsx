import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { ProductCard } from '../components/ProductCard';
import { VerifiedBadge } from '../components/VerifiedBadge';
import { store } from '../services/storeService';

interface ShopProfileProps {
    sellerId: string;
}

export const ShopProfileView: React.FC<ShopProfileProps> = ({ sellerId }) => {
    const { products, sellerReviews } = useStore();
    const sellerProducts = products.filter(p => p.sellerId === sellerId);
    const [activeTab, setActiveTab] = useState('products');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const reviews = sellerReviews.filter(r => r.sellerId === sellerId);
    const avgRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
        : '0.00';

    const handleSubmitReview = () => {
        if (comment.trim() === '') {
            store.addNotification("Vui lòng nhập bình luận!", "warning");
            return;
        }
        store.addSellerReview(sellerId, rating, comment);
        setComment('');
        setRating(5);
        setShowReviewForm(false);
    };

    const renderStars = (r: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i <= r ? 'text-secondary fill-secondary' : 'text-text-muted'}`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto pt-8 pb-32 lg:py-32 px-4 h-full">
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
                            <VerifiedBadge size="w-4 h-4" />
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
                <button 
                    onClick={() => setActiveTab('products')}
                    className={`px-8 py-3 rounded-2xl font-black text-[13px] tracking-tight flex items-center gap-2 transition-all ${
                        activeTab === 'products' 
                            ? 'bg-text-main text-white shadow-xl'
                            : 'bg-white border border-border-main text-text-muted hover:border-primary/40'
                    }`}
                >
                    Đang bán ({sellerProducts.length})
                </button>
                <button 
                    onClick={() => setActiveTab('sold')}
                    className={`px-8 py-3 rounded-2xl font-black text-[13px] tracking-tight transition-all ${
                        activeTab === 'sold'
                            ? 'bg-text-main text-white shadow-xl'
                            : 'bg-white border border-border-main text-text-muted hover:border-primary/40'
                    }`}
                >
                    Đã bán (142)
                </button>
                <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`px-8 py-3 rounded-2xl font-black text-[13px] tracking-tight transition-all ${
                        activeTab === 'reviews'
                            ? 'bg-text-main text-white shadow-xl'
                            : 'bg-white border border-border-main text-text-muted hover:border-primary/40'
                    }`}
                >
                    Đánh giá ({reviews.length})
                </button>
            </div>

            {activeTab === 'products' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {sellerProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {activeTab === 'reviews' && (
                <div className="space-y-6">
                    {!showReviewForm && (
                        <button 
                            onClick={() => setShowReviewForm(true)}
                            className="btn-primary !w-full !py-4"
                        >
                            ⭐ Viết đánh giá
                        </button>
                    )}

                    {showReviewForm && (
                        <div className="glass-card p-8 space-y-6 border border-border-main animate-in fade-in">
                            <h3 className="text-xl font-black text-text-main">Đánh giá của bạn</h3>
                            
                            <div>
                                <label className="text-sm font-black text-text-muted uppercase tracking-widest block mb-3">Đánh giá</label>
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <button
                                            key={i}
                                            onClick={() => setRating(i)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <svg
                                                className={`w-8 h-8 cursor-pointer ${
                                                    i <= rating ? 'text-secondary fill-secondary' : 'text-text-muted'
                                                }`}
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                            >
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-black text-text-muted uppercase tracking-widest block mb-3">Bình luận</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Chia sẻ trải nghiệm của bạn..."
                                    className="w-full bg-background border border-border-main rounded-2xl p-4 text-text-main placeholder:text-text-muted outline-none focus:border-primary transition-all resize-none"
                                    rows={4}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={handleSubmitReview}
                                    className="btn-primary flex-1"
                                >
                                    Gửi đánh giá
                                </button>
                                <button 
                                    onClick={() => setShowReviewForm(false)}
                                    className="bg-white border border-border-main text-text-muted hover:text-text-main px-6 py-3 rounded-2xl font-black transition-all flex-1"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {reviews.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-4xl mb-4">⭐</div>
                                <p className="text-text-muted font-medium">Chưa có đánh giá nào</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="bg-white p-6 rounded-2xl border border-border-main">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="font-black text-text-main">{review.buyerName}</div>
                                            <div className="flex gap-x-3 mt-1">
                                                {renderStars(review.rating)}
                                                <span className="text-xs text-text-muted font-bold">
                                                    {new Date(review.timestamp).toLocaleDateString('vi-VN')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-text-main leading-relaxed">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'sold' && (
                <div className="text-center py-16">
                    <p className="text-text-muted font-medium">Chuyên mục này sẽ sớm được cập nhật</p>
                </div>
            )}
        </div>
    );
};
