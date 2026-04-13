import React from 'react';
import { useStore, store } from '../../store';

export const ProfileView: React.FC = () => {
    const { currentUser, transactions } = useStore();

    if (!currentUser) return null;

    return (
        <div className="max-w-7xl mx-auto py-32 px-4 h-full">
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-10">
                {/* Profile Header Card */}
                <div className="glass-card p-10 lg:col-span-1 bg-gradient-to-br from-white to-primary/5">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative group mb-8">
                            <img 
                                src={currentUser.avatar} 
                                className="w-40 h-40 rounded-full border-4 border-white shadow-2xl p-1 bg-white group-hover:scale-105 transition-all duration-500" 
                            />
                            <div className="absolute bottom-4 right-4 bg-green-500 w-8 h-8 rounded-full border-4 border-white shadow-lg shadow-green-500/20" />
                        </div>
                        <h2 className="text-3xl font-black text-text-main mb-2 flex items-center gap-2">
                            {currentUser.name}
                            {currentUser.isVerified && (
                                <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
                                </svg>
                            )}
                        </h2>
                        <p className="text-text-muted font-bold text-sm mb-8">{currentUser.email}</p>
                        
                        <div className="grid grid-cols-2 gap-4 w-full mb-8">
                            <div className="bg-white/60 p-4 rounded-2xl border border-border-main text-center">
                                <div className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Đã mua</div>
                                <div className="text-xl font-black text-text-main">14</div>
                            </div>
                            <div className="bg-white/60 p-4 rounded-2xl border border-border-main text-center">
                                <div className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Đánh giá</div>
                                <div className="text-xl font-black text-primary">5.0</div>
                            </div>
                        </div>

                        {!currentUser.isVerified && (
                             <button className="bg-secondary text-white w-full py-4 rounded-2xl font-black text-[13px] tracking-widest uppercase hover:bg-secondary/90 shadow-xl transition-all">
                                Xác minh ngay
                             </button>
                        )}
                        <button 
                            onClick={() => store.logout()}
                            className="bg-background text-rose-500 border border-border-main w-full py-4 rounded-2xl font-black text-[13px] tracking-widest uppercase hover:bg-rose-50 hover:border-rose-200 transition-all mt-4 flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Đăng xuất
                        </button>
                    </div>
                </div>

                {/* Wallet & History section */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Wallet Card */}
                    <div className="bg-text-main rounded-[40px] p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 blur-[100px] rounded-full group-hover:bg-secondary/20 transition-all" />
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <div className="text-xs font-black text-white/60 uppercase tracking-widest mb-2">Số dư TillBid Wallet</div>
                                    <div className="text-5xl font-black tracking-tighter">{currentUser.balance.toLocaleString()}đ</div>
                                </div>
                                <div className="bg-white/10 p-4 rounded-[24px] backdrop-blur-xl border border-white/20">
                                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4">
                                <button className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-primary/20">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nạp tiền
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all backdrop-blur-xl border border-white/20">
                                    <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Rút về ngân hàng
                                </button>
                            </div>
                            
                            <div className="mt-12 flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                                <svg className="w-5 h-5 text-secondary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <div className="text-[13px] font-bold">Số dư đang đóng băng (Escrow): <span className="text-secondary">{currentUser.frozenBalance.toLocaleString()}đ</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="glass-card p-10">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black text-text-main">Lịch sử giao dịch</h3>
                            <button className="text-[11px] font-black uppercase text-primary hover:underline">Tải sao kê</button>
                        </div>
                        <div className="space-y-6">
                            {transactions.map(tx => (
                                <div key={tx.id} className="flex items-center gap-6 p-6 rounded-[24px] bg-background border border-border-main hover:border-primary/20 transition-all group">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                                        tx.status === 'disbursed' ? 'bg-green-100 text-green-600' : 'bg-secondary/10 text-secondary'
                                    }`}>
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={tx.status === 'disbursed' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' } />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-black text-text-main group-hover:text-primary transition-colors">{tx.title || 'Giao dịch TillBid'}</div>
                                        <div className="text-xs font-bold text-text-muted mt-1">{new Date(tx.timestamp).toLocaleDateString()} · {tx.status}</div>
                                    </div>
                                    <div className={`text-xl font-black ${
                                        tx.status === 'disbursed' ? 'text-green-500' : 'text-secondary'
                                    }`}>
                                        {tx.status === 'disbursed' ? '+' : ''}{tx.amount.toLocaleString()}đ
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
