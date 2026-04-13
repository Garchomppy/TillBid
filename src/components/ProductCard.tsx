import React, { useState, useEffect } from "react";
import type { Product } from "../types";
import { store } from "../services/storeService";
import { router } from "../router/routerService";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, Math.floor((product.endTime - Date.now()) / 1000)),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [product.endTime]);

  const isEndingSoon = timeLeft < 3600;

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s}s`;
  };

  const handleQuickBid = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextBid = product.currentPrice + 50000;
    store.placeBid(product.id, nextBid);
  };

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    store.addNotification(
      `Đã thêm ${product.name} vào danh sách theo dõi!`,
      "success",
    );
  };

  return (
    <div
      onClick={() => router.navigate("product", { id: product.id })}
      className="group glass-card glass-card-hover cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-background">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Pro Max Badge System */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.badge && (
            <div
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg ${
                product.badge === "hot"
                  ? "bg-primary text-white"
                  : product.badge === "ending"
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-secondary text-white"
              }`}
            >
              {product.badge}
            </div>
          )}
        </div>

        <button
          onClick={handleWatchlist}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:scale-110 transition-all shadow-lg border border-white"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Glass Timer */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-white px-2 py-1.5 rounded-2xl flex items-center gap-2 shadow-lg">
          <svg
            className={`w-3.5 h-3.5 ${isEndingSoon ? "text-rose-500 animate-spin-slow" : "text-text-muted"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span
            className={`text-xs font-black w-auto ${isEndingSoon ? "text-rose-500" : "text-text-main"}`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">
            {product.category}
          </span>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-background px-2.5 py-1 rounded-lg border border-border-main">
            {product.condition}
          </span>
        </div>

        <h3 className="font-extrabold text-text-main mb-4 line-clamp-1 text-lg leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-main/50">
          <div>
            <div className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">
              Giá hiện tại
            </div>
            <div className="text-xl font-black text-text-main group-hover:text-primary transition-colors">
              {product.currentPrice.toLocaleString()}đ
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1.5 text-text-muted mb-1 justify-end">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="text-[11px] font-black">
                {product.watchlistCount}
              </span>
            </div>
            <button
              onClick={handleQuickBid}
              className="bg-background hover:bg-primary text-black hover:text-white border border-border-main hover:border-primary p-2 rounded-xl transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
