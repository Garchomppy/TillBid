import React from 'react';

interface FilterBarProps {
    activeSort: string;
    onSortChange: (sort: string) => void;
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
    activeSort, 
    onSortChange, 
    activeCategory, 
    onCategoryChange 
}) => {
    const sortTabs = [
        { id: 'hot', label: 'Hot nhất', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { id: 'ending', label: 'Sắp hết', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'new', label: 'Mới nhất', icon: 'M12 4v16m8-8H4' },
        { id: 'cheap', label: 'Giá thấp', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
    ];

    const categories = [
        { name: 'Tất cả', icon: 'M4 6h16M4 12h16m-7 6h7' },
        { name: 'Thời trang', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { name: 'Công nghệ', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
        { name: 'Mỹ phẩm', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.691.387a2 2 0 01-1.132.252 2 2 0 01-1.132-.252l-.691-.387a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547M12 10.5a.5.5 0 110-1 .5.5 0 010 1z' },
        { name: 'Túi xách', icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' },
        { name: 'Giày dép', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' }
    ];

    return (
        <section id="products-section" className="max-w-7xl mx-auto px-4 py-12 mb-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-border-main pb-12">
                <div className="flex bg-white/60 p-1.5 rounded-full border border-border-main shadow-sm w-full md:w-auto">
                    {sortTabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => onSortChange(tab.id)}
                            className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-[13px] font-black transition-all flex items-center justify-center gap-2 ${
                                activeSort === tab.id 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                                : 'text-text-muted hover:text-text-main hover:bg-background'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                            </svg>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <select className="w-full bg-white border border-border-main rounded-full px-6 py-3 text-[13px] font-black outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer appearance-none min-w-[160px] text-text-main">
                            <option>Tình trạng</option>
                            <option>Như mới</option>
                            <option>Tốt</option>
                            <option>Khá</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 overflow-x-auto py-8 no-scrollbar scroll-smooth">
                {categories.map(cat => (
                    <button 
                        key={cat.name}
                        onClick={() => onCategoryChange(cat.name)}
                        className={`px-8 py-3 rounded-2xl text-[12px] font-black whitespace-nowrap transition-all border shrink-0 flex items-center gap-2 group ${
                            activeCategory === cat.name 
                            ? 'bg-text-main text-white border-text-main shadow-md' 
                            : 'bg-white border-border-main text-text-muted hover:border-primary/40 hover:text-text-main'
                        }`}
                    >
                        <svg className={`w-4 h-4 ${activeCategory === cat.name ? 'text-primary' : 'text-text-muted group-hover:text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                        </svg>
                        {cat.name}
                    </button>
                ))}
            </div>
        </section>
    );
};
