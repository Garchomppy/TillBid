import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`w-10 h-10 rounded-xl text-[13px] font-black transition-all border ${
                        currentPage === i 
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110' 
                        : 'bg-white border-border-main text-text-muted hover:border-primary/40 hover:text-text-main'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-16 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-border-main text-text-muted hover:border-primary/40 hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
            >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <div className="flex items-center gap-2 mx-2">
                {renderPageNumbers()}
            </div>

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-border-main text-text-muted hover:border-primary/40 hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
            >
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};
