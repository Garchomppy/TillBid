import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { router } from '../router/routerService';
import { ProductCard } from '../components/ProductCard';
import { Hero } from '../components/Hero';
import { FilterBar } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';
import { TOP_USERS } from '../data/topUsers';

export const HomeView: React.FC = () => {
    const { products } = useStore();
    const [activeSort, setActiveSort] = useState('hot');
    const [activeCategory, setActiveCategory] = useState('Tất cả');
    const [currentPage, setCurrentPage] = useState(1);
    const [leaderboardScroll, setLeaderboardScroll] = useState(0);
    const itemsPerPage = 8; // Show 8 products per page for a balanced grid

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeSort, activeCategory]);

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        // 1. Filter by Category
        if (activeCategory !== 'Tất cả') {
            result = result.filter(p => p.category === activeCategory);
        }

        // 2. Sort
        switch (activeSort) {
            case 'hot':
                result.sort((a, b) => (b.watchlistCount || 0) - (a.watchlistCount || 0));
                break;
            case 'new':
                result.sort((a, b) => b.endTime - a.endTime);
                break;
            case 'ending':
                result.sort((a, b) => a.endTime - b.endTime);
                break;
            case 'cheap':
                result.sort((a, b) => a.currentPrice - b.currentPrice);
                break;
            default:
                break;
        }

        return result;
    }, [products, activeSort, activeCategory]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Smooth scroll to top of product list
        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="pb-32">
            <Hero />
            
            <FilterBar 
                activeSort={activeSort}
                onSortChange={setActiveSort}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            <div className="max-w-7xl mx-auto px-4 min-h-[400px]">
                {paginatedProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-1">
                            {paginatedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className="py-32 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-background border border-border-main rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-text-main mb-2">Không tìm thấy sản phẩm</h3>
                        <p className="text-text-muted font-medium">Thử chọn danh mục khác hoặc xóa bộ lọc xem sao!</p>
                        <button 
                            onClick={() => { setActiveCategory('Tất cả'); setActiveSort('hot'); }}
                            className="btn-primary mt-8 px-10"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </div>

            {/* Reputation Ranking Section */}
            <section className="max-w-7xl mx-auto px-4 mt-32 mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-text-main mb-4">🏆 Bảng Xếp Hạng Uy Tín</h2>
                    <p className="text-text-muted max-w-2xl mx-auto font-medium">Những người bán hàng được tin cậy nhất trên TillBid - với điểm uy tín cao và nhiều giao dịch thành công.</p>
                </div>

                <div className="relative px-12">
                    {/* Scroll Container */}
                    <div 
                        id="leaderboardScroll"
                        className="flex gap-6 overflow-x-auto scroll-smooth pb-4 pt-4 no-scrollbar snap-x snap-mandatory"
                        onScroll={(e) => setLeaderboardScroll((e.target as HTMLDivElement).scrollLeft)}
                    >   
                        {TOP_USERS.map((user) => {
                            const getRankColor = (rank: number) => {
                                if (rank === 1) return 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 hover:shadow-2xl hover:shadow-amber-300/30';
                                if (rank === 2) return 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 hover:shadow-2xl hover:shadow-slate-300/30';
                                if (rank === 3) return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 hover:shadow-2xl hover:shadow-orange-300/30';
                                return 'bg-gradient-to-br from-white to-background border-border-main hover:shadow-xl hover:shadow-primary/20';
                            };

                            const getRankBadgeColor = (rank: number) => {
                                if (rank === 1) return 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/40';
                                if (rank === 2) return 'bg-gradient-to-br from-slate-300 to-slate-500 shadow-lg shadow-slate-400/40';
                                if (rank === 3) return 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/40';
                                return 'bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/40';
                            };

                            const getRankIcon = (rank: number) => {
                                if (rank === 1) return '1st';
                                if (rank === 2) return '2nd';
                                if (rank === 3) return '3rd';
                                return rank.toString();
                            };

                            return (
                                <div
                                    key={user.id}
                                    className={`relative p-8 rounded-[32px] border-2 text-center transition-all hover:-translate-y-3 group cursor-pointer flex-shrink-0 w-full sm:w-80 snap-center duration-300 ${getRankColor(user.rank)}`}
                                >
                                    {/* Rank Badge with Shine Effect */}
                                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-sm shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300 ${getRankBadgeColor(user.rank)}`}>
                                        <span className="relative">
                                            {getRankIcon(user.rank)}
                                            {user.rank <= 3 && (
                                                <div className="absolute inset-0 rounded-full bg-white/20 blur-sm animate-pulse"></div>
                                            )}
                                        </span>
                                    </div>

                                    {/* Avatar */}
                                    <img 
                                        src={user.avatar} 
                                        alt={user.name} 
                                        className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-white shadow-md group-hover:scale-110 transition-transform duration-300" 
                                    />

                                    {/* Name with Badge */}
                                    <div className="font-black text-text-main mb-2 line-clamp-2 flex items-center justify-center gap-2 group-hover:text-primary transition-colors duration-200">
                                        <span className="truncate">{user.name}</span>
                                        {user.isVerified && (
                                            <svg className="w-5 h-5 text-secondary flex-shrink-0 group-hover:scale-125 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Score */}
                                    <div className="flex items-center justify-center gap-1.5 mb-3 text-sm font-black text-text-main">
                                        <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                        <span className="tracking-tight">{user.reputation}</span>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-gradient-to-r from-transparent via-text-muted/20 to-transparent mb-3"></div>

                                    {/* Transactions */}
                                    <div className="text-[11px] text-text-muted font-bold mb-2">
                                        💼 {user.successfulTransactions} giao dịch
                                    </div>

                                    {/* Followers */}
                                    <div className="text-[11px] font-bold text-primary mb-4">
                                        👥 {user.followers} người theo dõi
                                    </div>

                                    {/* View Shop Button */}
                                    <button 
                                        onClick={() => router.navigate('shop', { id: user.name })}
                                        className="w-full bg-primary/10 hover:bg-primary hover:text-white text-primary font-black px-4 py-2.5 rounded-[16px] transition-all text-sm duration-200 hover:shadow-lg group-hover:scale-100 active:scale-95"
                                    >
                                        Xem Shop
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Scroll Indicators */}
                    {leaderboardScroll > 0 && (
                        <button
                            onClick={() => {
                                const container = document.getElementById('leaderboardScroll');
                                if (container) container.scrollBy({ left: -320, behavior: 'smooth' });
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-200 z-10 cursor-pointer active:scale-95"
                            aria-label="Scroll left"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    {leaderboardScroll < ((TOP_USERS.length - 3) * 320) && (
                        <button
                            onClick={() => {
                                const container = document.getElementById('leaderboardScroll');
                                if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-200 z-10 cursor-pointer active:scale-95"
                            aria-label="Scroll right"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            </section>
            <section className="max-w-7xl mx-auto px-4 mt-32">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-text-main mb-4">Cách hoạt động</h2>
                    <p className="text-text-muted max-w-lg mx-auto font-medium">Quy trình đấu giá minh bạch, an toàn tuyệt đối cho người đam mê đồ hiệu & đồ cũ.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { 
                            icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z', 
                            title: 'Đăng sản phẩm', 
                            desc: 'Chụp ảnh thật, video chi tiết. AI gợi ý giá sàn tự động giúp bạn bán nhanh hơn.' 
                        },
                        { 
                            icon: 'M13 10V3L4 14h7v7l9-11h-7z', 
                            title: 'Đấu giá sôi nổi', 
                            desc: 'Người mua trả giá minh bạch qua hệ thống. Thông báo ngay khi bị vượt giá.' 
                        },
                        { 
                            icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', 
                            title: 'Ví trung gian', 
                            desc: 'Bảo vệ quyền lợi cả hai bên. Tiền chỉ được giải ngân khi hàng đã đến tay.' 
                        },
                        { 
                            icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8', 
                            title: 'Ship tận nơi', 
                            desc: 'Đối tác vận chuyển chuyên nghiệp đến lấy hàng tận nhà. Theo dõi Real-time.' 
                        }
                    ].map((step, i) => (
                        <div key={i} className="group glass-card p-10 text-center hover:-translate-y-2 hover:border-primary/30 transition-all duration-300">
                            <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/10 transition-colors">
                                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black mb-4 text-text-main">{step.title}</h3>
                            <p className="text-[13px] text-text-muted leading-relaxed font-semibold">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
