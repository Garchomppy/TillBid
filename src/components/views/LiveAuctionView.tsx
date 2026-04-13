import React, { useState, useEffect, useRef } from 'react';

const MOCK_MESSAGES = [
    { user: 'Hồng Quân', text: 'Hàng đẹp quá shop ơi!' },
    { user: 'Thanh Thảo', text: 'Có bảo hành không ạ?' },
    { user: 'Minh Nhật', text: 'Chốt đơn chốt đơn!' },
    { user: 'Gia Bảo', text: 'Giá đang hời quá kìa' },
    { user: 'Quỳnh Anh', text: 'Đã đặt cọc hy vọng trúng' },
    { user: 'Kevin Nguyen', text: 'Authentic 100% chứ shop?' },
    { user: 'Bảo Thy', text: 'Đẹp vãi chưởng' }
];

export const LiveAuctionView: React.FC = () => {
    const [messages, setMessages] = useState([
        { user: 'Hà Linh', text: 'Chào cả nhà nhé ❤️', id: 1 },
        { user: 'Tuấn MD', text: 'Shop ơi check inbox giúp mình', id: 2 }
    ]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomMsg = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
            setMessages(prev => [...prev.slice(-10), { ...randomMsg, id: Date.now() }]);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="max-w-7xl mx-auto py-32 px-4 h-full">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
                <div className="bg-rose-500 text-white px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-rose-500/20">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Trực tiếp
                </div>
                <h2 className="text-3xl font-black text-text-main flex-1">Livestream Đấu Giá: Tech & Gadget</h2>
                <div className="flex items-center gap-2 text-text-muted font-bold bg-white px-5 py-2 rounded-full border border-border-main shadow-sm">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    1,247 viewers
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 aspect-video bg-text-main rounded-[40px] flex items-center justify-center border-8 border-white shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent"></div>
                    <div className="text-center group cursor-pointer relative z-10">
                        <div className="w-24 h-24 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-all border border-white/20">
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <p className="text-white font-black text-lg tracking-tight">Kênh đang kết nối...</p>
                    </div>
                </div>
                
                <div className="space-y-8">
                    <div className="glass-card p-8 border-primary/20 bg-gradient-to-br from-white to-primary/5">
                        <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">Giá hiện tại</span>
                        <div className="text-4xl font-black text-primary my-4 tracking-tighter">12,500,000đ</div>
                        <div className="flex items-center gap-2 text-sm font-bold text-text-main mb-6">
                            <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Leader: user_***789
                        </div>
                        <div className="bg-text-main text-white rounded-2xl p-4 text-center font-black flex items-center justify-center gap-3">
                            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            00:04:32
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                        <button className="bg-white hover:bg-primary hover:text-white border border-border-main py-3 rounded-2xl text-[13px] font-black transition-all">+500k</button>
                        <button className="bg-white hover:bg-primary hover:text-white border border-border-main py-3 rounded-2xl text-[13px] font-black transition-all">+1tr</button>
                        <button className="bg-white hover:bg-primary hover:text-white border border-border-main py-3 rounded-2xl text-[13px] font-black transition-all">+2tr</button>
                    </div>
                    
                    <div className="glass-card h-[320px] flex flex-col overflow-hidden border-border-main shadow-sm">
                        <div className="p-5 border-b border-border-main bg-background font-black text-[13px] uppercase tracking-widest text-text-main">Trò chuyện trực tiếp</div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm font-medium no-scrollbar">
                            {messages.map(msg => (
                                <div key={msg.id} className="flex gap-2 animate-in slide-in-from-bottom-2 fade-in">
                                    <span className="font-black text-secondary whitespace-nowrap">{msg.user}:</span>
                                    <span className="text-text-main">{msg.text}</span>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="p-4 bg-background border-t border-border-main flex gap-3">
                            <input className="flex-1 bg-white border border-border-main rounded-xl px-4 py-2 outline-none text-sm font-semibold focus:border-primary transition-all" placeholder="Nhắn tin..." />
                            <button className="btn-primary !p-2 !w-10 !h-10 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
