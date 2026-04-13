import React, { useState } from 'react';
import { Modal } from './Modal';

interface DeliveryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: DeliveryData) => void;
    productName: string;
}

export interface DeliveryData {
    address: string;
    phone: string;
    note: string;
}

export const DeliveryModal: React.FC<DeliveryModalProps> = ({ isOpen, onClose, onConfirm, productName }) => {
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = () => {
        if (!address || !phone) return;
        onConfirm({ address, phone, note });
        onClose();
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Thông tin nhận hàng"
        >
            <div className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Sản phẩm chiến thắng</div>
                    <div className="text-xl font-black text-text-main">{productName}</div>
                </div>

                <div className="space-y-4">
                    <div className="form-group">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2 mb-2 block">Địa chỉ nhận hàng</label>
                        <input 
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-background border-2 border-border-main rounded-2xl px-6 py-4 font-bold text-text-main outline-none focus:border-primary transition-all"
                            placeholder="Số nhà, tên đường, quận/huyện..."
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2 mb-2 block">Số điện thoại</label>
                        <input 
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-background border-2 border-border-main rounded-2xl px-6 py-4 font-bold text-text-main outline-none focus:border-primary transition-all"
                            placeholder="0xxx xxx xxx"
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2 mb-2 block">Ghi chú (Tùy chọn)</label>
                        <textarea 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-background border-2 border-border-main rounded-2xl px-6 py-4 font-bold text-text-main outline-none focus:border-primary transition-all min-h-[100px]"
                            placeholder="Hướng dẫn giao hàng cụ thể..."
                        />
                    </div>
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={!address || !phone}
                    className="btn-primary w-full py-6 text-lg font-black shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 disabled:bg-background disabled:text-text-muted"
                >
                    Xác nhận địa chỉ
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
                <p className="text-center text-[10px] font-bold text-text-muted uppercase tracking-widest">Thông tin sẽ được chuyển trực tiếp cho đối tác giao vận</p>
            </div>
        </Modal>
    );
};
