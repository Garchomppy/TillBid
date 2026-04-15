import React, { useState, useEffect, useRef } from "react";
import { useStore } from "../hooks/useStore";
import { store } from "../services/storeService";
import { formatPriceVN, formatQuickBidLabel } from "../utils";

const MOCK_BOTS = [
  "Hồng Quân",
  "Thanh Thảo",
  "Minh Nhật",
  "Gia Bảo",
  "Quỳnh Anh",
  "Kevin Nguyen",
];

export const LiveAuctionView: React.FC = () => {
  const { products, currentUser } = useStore();
  // Using p2 (iPhone 13 Pro) as the mock live product
  const product = products.find((p) => p.id === "p2");

  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [bidHistory, setBidHistory] = useState<
    { id: number; name: string; amount: number; isMe: boolean; time: string }[]
  >([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Initialize Bid History
  useEffect(() => {
    if (bidHistory.length === 0 && product) {
      setBidHistory([
        {
          id: 1,
          name: "System",
          amount: product.startPrice,
          isMe: false,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  }, [product]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isFinished && product) {
        setIsFinished(true);
        // Finalize if needed
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished, product]);

  // Bot bidding logic
  useEffect(() => {
    if (isFinished || !product) return;

    const interval = setInterval(() => {
      // High chance bot outbids user or another bot to keep pressure
      const isUserLeading = product.highestBidderId === currentUser?.id;
      const shouldBid = isUserLeading
        ? Math.random() > 0.3
        : Math.random() > 0.6;

      if (shouldBid) {
        const botName = MOCK_BOTS[Math.floor(Math.random() * MOCK_BOTS.length)];
        const increment = Math.random() > 0.7 ? 1000000 : 500000;
        const newPrice = product.currentPrice + increment;

        store.placeBotBid(product.id, botName, newPrice);
        setBidHistory((prev) => [
          ...prev.slice(-20),
          {
            id: Date.now(),
            name: botName,
            amount: newPrice,
            isMe: false,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [isFinished, product?.currentPrice, currentUser?.id]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bidHistory]);

  const handleQuickBid = (increment: number) => {
    if (!product || !currentUser || isFinished) return;

    const newPrice = product.currentPrice + increment;

    try {
      store.placeBid(product.id, newPrice);
      setBidHistory((prev) => [
        ...prev.slice(-20),
        {
          id: Date.now(),
          name: currentUser.name,
          amount: newPrice,
          isMe: true,
          time: new Date().toLocaleTimeString(),
        },
      ]);

      // Auto-extend timer by 15s if winning bid in last 30s
      if (timeLeft <= 30) {
        setTimeLeft((prev) => prev + 15);
      }
    } catch (err: any) {
      store.addNotification(
        err.message || "Bạn không thể đặt giá lúc này.",
        "warning",
      );
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `00:${m}:${s}`;
  };

  if (!product) return null;

  const getLeaderName = () => {
    if (!product.highestBidderId) return "Chưa có";
    if (product.highestBidderId === currentUser?.id) return "Bạn";
    if (product.highestBidderId.startsWith("mock_"))
      return product.highestBidderId.replace("mock_", "");
    return "User_" + product.highestBidderId.substr(0, 4);
  };

  const isUserWinner =
    isFinished && product.highestBidderId === currentUser?.id;

  return (
    <div className="max-w-7xl mx-auto pt-8 pb-32 lg:py-32 px-4 h-full relative">
      {/* Winner Overlay */}
      {isFinished && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 rounded-[40px] backdrop-blur-md bg-black/60">
          <div className="bg-white p-12 rounded-[40px] text-center max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="text-6xl mb-6">{isUserWinner ? "🎉" : "😥"}</div>
            <h2
              className={`text-3xl font-black mb-4 ${isUserWinner ? "text-primary" : "text-text-main"}`}
            >
              {isUserWinner
                ? "Chúc mừng bạn đã trúng thầu!"
                : "Phiên đấu giá đã kết thúc"}
            </h2>
            <p className="text-text-muted font-bold mb-8">
              {isUserWinner
                ? "Sản phẩm đã thuộc về bạn với mức giá " +
                  formatPriceVN(product.currentPrice) +
                  ". Số tiền cọc sẽ được giữ hộ để hoàn tất giao dịch."
                : `Bạn đã trượt mất cơ hội. Sản phẩm về tay ${getLeaderName()} với giá ${formatPriceVN(product.currentPrice)}.`}
            </p>
            {isUserWinner && (
              <button
                onClick={() => (window.location.href = "#/profile")}
                className="btn-primary w-full py-4 rounded-2xl shadow-xl shadow-primary/20"
              >
                Tới Profile điền đơn hàng
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
        <div className="bg-rose-500 text-white px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-rose-500/20">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Trực tiếp
        </div>
        <h2 className="text-3xl font-black text-text-main flex-1">
          Livestream Đấu Giá: Tech & Gadget
        </h2>
        <div className="flex items-center gap-2 text-text-muted font-bold bg-white px-5 py-2 rounded-full border border-border-main shadow-sm">
          <svg
            className="w-4 h-4 text-primary"
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
          1,247 viewers
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Stream Video Focus */}
        <div className="lg:col-span-2 aspect-video bg-text-main rounded-[40px] flex justify-center items-end pb-8 border-8 border-white shadow-2xl overflow-hidden relative group">
          <img
            src={product.image}
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <div className="relative z-10 w-full px-10 flex justify-between items-end">
            <div className="text-white">
              <div className="font-black text-2xl drop-shadow-md">
                {product.name}
              </div>
              <div className="text-sm font-bold text-white/80 uppercase tracking-widest mt-1">
                Hàng hiếm • Live
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Price Tracking Board */}
          <div className="glass-card p-8 border-primary/20 bg-gradient-to-br from-white to-primary/5 shadow-xl shadow-primary/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">
                Giá hiện tại
              </span>
              <div
                className={`bg-text-main ${timeLeft <= 30 ? "bg-rose-500 animate-pulse" : ""} text-white rounded-2xl px-4 py-2 font-black flex items-center justify-center gap-2`}
              >
                <svg
                  className="w-4 h-4"
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
                {formatTime(timeLeft)}
              </div>
            </div>

            <div
              className="text-5xl font-black text-primary my-4 tracking-tighter"
              key={product.currentPrice}
            >
              {formatPriceVN(product.currentPrice)}
            </div>

            <div className="flex items-center gap-3 bg-white/50 p-4 rounded-2xl border border-white">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black">
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
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                  Đang dẫn đầu
                </div>
                <div
                  className={`font-bold ${product.highestBidderId === currentUser?.id ? "text-green-600" : "text-text-main"}`}
                >
                  {getLeaderName()}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Bid Controls */}
          <div>
            <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">
              Đặt giá nhanh
            </div>
            <div className="grid grid-cols-3 gap-2 ">
              {[
                { increment: 50000 },
                { increment: 100000 },
                { increment: 200000 },
                { increment: 500000 },
                { increment: 1000000 },
                { increment: 2000000 },
              ].map(({ increment }) => (
                <button
                  key={increment}
                  disabled={isFinished}
                  onClick={() => handleQuickBid(increment)}
                  className="bg-white text-black hover:bg-primary hover:text-white disabled:opacity-40 border border-border-main py-3 rounded-2xl text-[11px] font-black transition-all shadow-sm hover:shadow-md hover:shadow-primary/20 active:scale-95"
                >
                  {formatQuickBidLabel(increment)}
                </button>
              ))}
            </div>
          </div>

          {/* Bid History Log */}
          <div className="glass-card h-[300px] flex flex-col overflow-hidden border-border-main shadow-sm">
            <div className="p-5 border-b border-border-main bg-background flex flex-col">
              <span className="font-black text-[13px] uppercase tracking-widest text-text-main mb-1">
                Lịch sử trả giá
              </span>
              <span className="text-[10px] font-bold text-text-muted">
                Dữ liệu chỉ bao gồm phiền live này
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm font-medium no-scrollbar">
              {bidHistory.map((log) => (
                <div
                  key={log.id}
                  className={`flex flex-col animate-in slide-in-from-bottom-2 fade-in p-3 rounded-2xl border ${log.isMe ? "bg-primary/5 border-primary/20 items-end text-right" : "bg-background border-border-main items-start text-left"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-black uppercase tracking-wider text-[10px] ${log.isMe ? "text-primary" : "text-secondary"}`}
                    >
                      {log.name}
                    </span>
                    <span className="text-[10px] font-bold text-text-muted">
                      {log.time}
                    </span>
                  </div>
                  <div
                    className={`font-black text-lg ${log.isMe ? "text-primary" : "text-text-main"}`}
                  >
                    {formatPriceVN(log.amount)}
                  </div>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
