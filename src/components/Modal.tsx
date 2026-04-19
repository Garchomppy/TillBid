import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text-main/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative glass-card w-full max-w-lg bg-white overflow-hidden animate-in zoom-in-95 fade-in slide-in-from-bottom-8 duration-500 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)]">
        {/* Header */}
        <div className="px-10 py-8 border-b border-border-main flex items-center justify-between bg-gradient-to-r from-transparent to-primary/5">
          <h3 className="text-2xl font-black text-text-main">{title}</h3>
          <button
            onClick={onClose}
            className="p-3 bg-background border border-border-main rounded-2xl text-text-muted hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-90"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-10 py-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
