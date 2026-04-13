import React, { useState, useEffect } from 'react';
import { router } from '../router';

export const Hero: React.FC = () => {
    const [timer, setTimer] = useState("05:12");

    useEffect(() => {
        const interval = setInterval(() => {
            const [m, s] = timer.split(':').map(Number);
            let totalSeconds = m * 60 + s;
            if (totalSeconds > 0) {
                totalSeconds--;
                const newM = Math.floor(totalSeconds / 60);
                const newS = totalSeconds % 60;
                setTimer(`${newM.toString().padStart(2, '0')}:${newS.toString().padStart(2, '0')}`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    return (
        <section className="relative overflow-hidden pt-40 pb-20 px-4 transition-colors duration-500">
            {/* Background blobs with Pro Max Light Colors */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animate-blob" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full animate-blob animation-delay-2000" />
            
            <div className="max-w-7xl mx-auto relative z-10 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/60 border border-primary/20 backdrop-blur-xl px-4 py-2 rounded-full mb-8 shadow-sm">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            <span className="text-primary text-[11px] font-black uppercase tracking-widest">
                                Nền tảng đấu giá #1 Việt Nam
                            </span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] text-text-main">
                            Săn đồ <span className="text-primary italic">độc lạ</span><br />
                            Giá cực <span className="text-secondary relative">
                                hời
                                <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                                </svg>
                            </span>
                        </h1>
                        
                        <p className="text-lg text-text-muted mb-10 max-w-lg leading-relaxed font-medium mx-auto lg:mx-0">
                            Đấu giá đồ hiệu, công nghệ và phụ kiện cao cấp. An toàn, minh bạch, phấn khích. Sở hữu món đồ yêu thích chỉ từ 0đ.
                        </p>
                        
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <button 
                                onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-primary !px-12 !py-4.5 text-lg font-black group flex items-center gap-3"
                            >
                                Đấu giá ngay
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => router.navigate('live')}
                                className="bg-white hover:bg-background border border-border-main px-10 py-4.5 rounded-full font-black text-lg transition-all shadow-sm hover:shadow-md text-text-main"
                            >
                                Xem Livestream
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-12 mt-16 pt-8 border-t border-border-main/50 max-w-md mx-auto lg:mx-0">
                            {[
                                { val: '12k+', label: 'Sản phẩm' },
                                { val: '8k+', label: 'Người dùng' },
                                { val: '98%', label: 'Hài lòng' }
                            ].map(stat => (
                                <div key={stat.label}>
                                    <div className="text-2xl font-black text-text-main">{stat.val}</div>
                                    <div className="text-[10px] font-extrabold text-text-muted uppercase tracking-widest mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="relative hidden lg:block h-[500px]">
                        <div className="absolute inset-0 z-10">
                            {/* Floating Cards with Pro Max Styling */}
                            <div className="absolute top-[15%] right-[10%] glass-card p-6 w-64 transform rotate-6 border-white/60 bg-white/40 backdrop-blur-xl animate-float shadow-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">AF</div>
                                    <div className="font-black text-xs text-text-main">Nike AF1</div>
                                </div>
                                <div className="text-[11px] font-bold text-text-muted">Đang đấu: 1,200,000đ</div>
                                <div className="mt-3 h-1 w-full bg-border-main rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-2/3"></div>
                                </div>
                            </div>
                            
                            <div className="absolute bottom-[20%] left-[5%] glass-card p-6 w-64 transform -rotate-12 border-white/60 bg-white/40 backdrop-blur-xl animate-float animation-delay-1000 shadow-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xs">IP</div>
                                    <div className="font-black text-xs text-text-main">iPhone 13</div>
                                </div>
                                <div className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Sắp kết thúc: <span className="text-secondary font-black">{timer}</span></div>
                                <div className="mt-3 flex gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                                    <div className="h-1.5 w-full bg-rose-500/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${(parseInt(timer.split(':')[1]) / 60) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute top-[50%] left-[40%] glass-card p-6 w-60 transform rotate-3 border-white/60 bg-white/40 backdrop-blur-xl animate-float animation-delay-2000 shadow-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">LV</div>
                                    <div className="font-black text-xs text-text-main">Túi LV</div>
                                </div>
                                <div className="text-[11px] font-bold text-text-muted">HOT: 142 bidders</div>
                            </div>
                        </div>
                        
                        {/* Decorative Background Decoration */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border-2 border-dashed border-primary/10 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-secondary/10 rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
};
