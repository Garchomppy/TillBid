import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../store';
import { ProductCard } from '../ProductCard';
import { Hero } from '../Hero';
import { FilterBar } from '../FilterBar';
import { Pagination } from '../Pagination';

export const HomeView: React.FC = () => {
    const { products } = useStore();
    const [activeSort, setActiveSort] = useState('hot');
    const [activeCategory, setActiveCategory] = useState('Tất cả');
    const [currentPage, setCurrentPage] = useState(1);
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

            {/* How it works section */}
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
