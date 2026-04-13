import React from 'react';

export const VerifiedBadge: React.FC<{ size?: string }> = ({ size = "w-5 h-5" }) => (
    <div className={`${size} bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0`}>
        <svg className="w-3/5 h-3/5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    </div>
);
