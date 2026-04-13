import React, { useState } from 'react';
import { store } from '../../store';
import { router } from '../../router';

export const PostItemView: React.FC = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [category, setCategory] = useState('Thời trang');
    const [description, setDescription] = useState('');

    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();
        const id = store.postProduct({
            name,
            description,
            category,
            startPrice: price,
            durationHours: 24
        });
        if (id) {
            router.navigate('product', { id });
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-32 px-4 h-full">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-text-main mb-4">Đăng bán sản phẩm</h2>
                    <p className="text-text-muted font-medium">Bán món đồ cũ của bạn với giá hời nhất thông qua đấu giá.</p>
                </div>

                <div className="glass-card p-12 bg-white/70 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />
                    
                    <form onSubmit={handlePost} className="space-y-10 relative z-10">
                        {/* Image Upload Placeholder */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Hình ảnh sản phẩm</label>
                            <div className="group border-2 border-dashed border-border-main rounded-[32px] p-16 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer bg-background/50">
                                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="text-lg font-black text-text-main">Tải ảnh lên</div>
                                <p className="text-sm text-text-muted font-bold mt-2">Kéo thả hoặc nhấn để chọn ảnh (Tối đa 5 ảnh)</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Tên sản phẩm</label>
                                <input 
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ví dụ: iPhone 13 Pro 256GB"
                                    className="w-full bg-background border border-border-main rounded-2xl px-6 py-4 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-text-main"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Danh mục</label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-background border border-border-main rounded-2xl px-6 py-4 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-black text-text-main cursor-pointer appearance-none"
                                >
                                    <option>Thời trang</option>
                                    <option>Công nghệ</option>
                                    <option>Mỹ phẩm</option>
                                    <option>Túi xách</option>
                                    <option>Giày dép</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Giá khởi điểm (đ)</label>
                                <input 
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="w-full bg-background border border-border-main rounded-2xl px-6 py-4 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-black text-xl text-text-main"
                                    required
                                />
                                <div className="text-[10px] text-secondary font-black uppercase tracking-widest mt-2 px-2 italic flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    AI gợi ý: 200,000đ - 350,000đ
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Thời gian đấu giá</label>
                                <div className="flex bg-background p-1.5 rounded-2xl border border-border-main">
                                    <button type="button" className="flex-1 py-3.5 rounded-[14px] bg-white text-primary text-[11px] font-black uppercase tracking-widest shadow-md">24 Giờ</button>
                                    <button type="button" className="flex-1 py-3.5 rounded-[14px] text-text-muted text-[11px] font-black uppercase tracking-widest hover:text-text-main">48 Giờ</button>
                                    <button type="button" className="flex-1 py-3.5 rounded-[14px] text-text-muted text-[11px] font-black uppercase tracking-widest hover:text-text-main">3 Ngày</button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Mô tả chi tiết</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                placeholder="Mô tả tình trạng, lỗi (nếu có), xuất xứ..."
                                className="w-full bg-background border border-border-main rounded-[32px] px-8 py-6 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-text-main resize-none"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary w-full py-5 text-lg font-black shadow-2xl shadow-primary/20 flex items-center justify-center gap-4"
                        >
                            Đăng đấu giá ngay
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
