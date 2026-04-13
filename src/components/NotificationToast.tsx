import React from 'react';
import { useStore } from '../store';

export const NotificationToast: React.FC = () => {
    const { notifications } = useStore();
    
    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
            {notifications.map(n => (
                <div 
                    key={n.id} 
                    className={`bg-white/90 backdrop-blur-2xl border border-border-main p-5 rounded-[24px] shadow-[0_20px_40px_rgba(236,72,153,0.1)] flex items-center gap-4 animate-in slide-in-from-right fade-in duration-500`}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                         n.type === 'success' ? 'bg-green-100 text-green-600' : 
                         n.type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-primary/10 text-primary'
                    }`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={
                                n.type === 'success' ? 'M5 13l4 4L19 7' : 
                                n.type === 'warning' ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' : 
                                'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                            } />
                        </svg>
                    </div>
                    <div>
                        <div className="text-[13px] font-black text-text-main leading-tight">{n.message}</div>
                        <div className="text-[10px] font-bold text-text-muted mt-0.5">Vừa xong</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
