import React from 'react';
import { router } from '../router/routerService';
import { useRouter } from '../hooks/useRouter';

export const BottomNavBar: React.FC = () => {
    const { view } = useRouter();

    const navItems = [
        { id: 'home', label: 'Trang chủ', icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )},
        { id: 'live', label: 'Trực tiếp', icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553 2.276A1 1 0 0120 13.17V17a1 1 0 01-.447.894L15 20.236M15 10V20.236M15 10l-4.553-2.276A1 1 0 0010 8.83V16a1 1 0 00.447.894L15 20.236M4 16.5L12 21l8-4.5M4 12l8 4.5 8-4.5M4 7.5L12 12l8-4.5" />
            </svg>
        )},
        { id: 'post', label: 'Đăng tin', icon: (
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center -mt-8 shadow-lg shadow-primary/30 border-4 border-background transition-transform hover:scale-110 active:scale-95">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </div>
        )},
        { id: 'profile', label: 'Cá nhân', icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        )}
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
            <div className="glass-card flex items-center justify-around px-2 py-3 shadow-2xl border-white/20">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => router.navigate(item.id as any)}
                        className={`flex flex-col items-center gap-1 transition-all ${
                            view === item.id 
                            ? 'text-primary scale-110' 
                            : 'text-text-muted hover:text-text-main'
                        }`}
                    >
                        {item.icon}
                        {item.id !== 'post' && (
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                {item.label}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
