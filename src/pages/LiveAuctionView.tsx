import React, { useState, useEffect, useRef } from "react";
import { useStore } from "../hooks/useStore";
import { store } from "../services/storeService";
import { formatPriceVN, formatQuickBidLabel } from "../utils";
import { MOCK_BOTS, MOCK_COMMENTS } from "../data/mockLive";

export const LiveAuctionView: React.FC = () => {
  const { products, currentUser } = useStore();
  const product = products.find((p) => p.id === "p2");

  const [timeLeft, setTimeLeft] = useState(20);
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
        store.finalizeAuction(product.id);
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
        setTimeLeft((prev) => prev + 5);
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
    return "User_" + product.highestBidderId.substring(0, 4);
  };

  const isUserWinner =
    isFinished && product.highestBidderId === currentUser?.id;

  // --- States bổ sung để fix lỗi ---
  const [activeTab, setActiveTab] = useState<"history" | "comments">("history");
  const [manualBidAmount, setManualBidAmount] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const [comments, setComments] = useState<
    { id: number; name: string; comment: string; isMe: boolean; time: string }[]
  >([
    {
      id: 1,
      name: "Thanh Hằng",
      comment: "Máy đẹp quá shop ơi 😍",
      isMe: false,
      time: "14:20",
    },
    {
      id: 2,
      name: "Quốc Bảo",
      comment: "Đang hóng kèo này mãi",
      isMe: false,
      time: "14:21",
    },
    {
      id: 3,
      name: "Diệu Linh",
      comment: "Có được kiểm tra hàng trước khi thanh toán không ạ?",
      isMe: false,
      time: "14:22",
    },
  ]);

  const [chatMessages, setChatMessages] = useState<
    { id: number; name: string; message: string; isMe: boolean; time: string }[]
  >([
    {
      id: 1,
      name: "System",
      message: "Chào mừng mọi người đến với phiên đấu giá hôm nay!",
      isMe: false,
      time: "14:00",
    },
    {
      id: 2,
      name: "Admin",
      message: "Sản phẩm iPhone 13 Pro đang có giá cực hời nha cả nhà.",
      isMe: false,
      time: "14:05",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Khởi tạo lịch sử đấu giá
  useEffect(() => {
    if (bidHistory.length === 0 && product) {
      setBidHistory([
        {
          id: 1,
          name: "System",
          amount: product.startPrice,
          isMe: false,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  }, [product, bidHistory.length]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!isFinished) {
        setIsFinished(true);
        if (product && product.status === "active") {
          store.finalizeAuction(product.id);
        }
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished, product]);

  // Bot & Comment Simulation Logic
  useEffect(() => {
    if (isFinished || !product) return;

    const intervalId = setInterval(() => {
      const isUserLeading = product.highestBidderId === currentUser?.id;
      
      // 1. Simulat Bot Bid
      const shouldBid = isUserLeading ? Math.random() > 0.4 : Math.random() > 0.7;
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
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }

      // 2. Simulate Random Comment
      if (Math.random() > 0.5) {
        const botName = MOCK_BOTS[Math.floor(Math.random() * MOCK_BOTS.length)];
        const comment = MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)];
        setComments((prev) => [
          ...prev.slice(-15),
          {
            id: Date.now(),
            name: botName,
            comment: comment,
            isMe: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    }, 8000);

    return () => clearInterval(intervalId);
  }, [isFinished, product?.currentPrice, product?.id, currentUser?.id]);

  // Auto scroll
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bidHistory, chatMessages, activeTab]);

  // Penalty Check Effect
  useEffect(() => {
    if (
      isFinished &&
      product &&
      product.paymentStatus === "pending" &&
      product.paymentDeadline
    ) {
      const interval = setInterval(() => {
        if (Date.now() > product.paymentDeadline!) {
          store.applyPenalty(product.id);
          clearInterval(interval);
        }
      }, 5000); // Check every 5s
      return () => clearInterval(interval);
    }
  }, [
    isFinished,
    product?.paymentStatus,
    product?.paymentDeadline,
    product?.id,
  ]);

  const handleManualBid = () => {
    const amount = parseInt(manualBidAmount);
    if (!product || isNaN(amount) || amount <= product.currentPrice) {
      store.addNotification("Giá đặt phải cao hơn giá hiện tại!", "warning");
      return;
    }
    processBid(amount);
    setManualBidAmount("");
  };

  const processBid = (newPrice: number) => {
    try {
      store.placeBid(product!.id, newPrice);
      setBidHistory((prev) => [
        ...prev.slice(-19),
        {
          id: Date.now(),
          name: currentUser!.name,
          amount: newPrice,
          isMe: true,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      if (timeLeft <= 30) setTimeLeft((prev) => prev + 15);
    } catch (err: any) {
      store.addNotification(err.message || "Lỗi đặt giá", "warning");
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;
    setComments([
      ...comments,
      {
        id: Date.now(),
        name: currentUser.name,
        comment: newComment,
        isMe: true,
        time: "Vừa xong",
      },
    ]);
    setNewComment("");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser) return;
    setChatMessages([
      ...chatMessages,
      {
        id: Date.now(),
        name: currentUser.name,
        message: newMessage,
        isMe: true,
        time: "Vừa xong",
      },
    ]);
    setNewMessage("");
  };

  return (
    <div className="max-w-7xl mx-auto pt-8 pb-32 lg:py-32 px-4 h-full relative">
      {/* Policy Agreement Overlay */}
      {currentUser && !currentUser.hasAgreedToLivePolicy && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-xl bg-black/40">
          <div className="bg-white p-8 rounded-[32px] text-center max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="text-5xl mb-6">📜</div>
            <h2 className="text-2xl font-black mb-4 text-text-main">
              Cam Kết Đấu Giá Live
            </h2>
            <div className="text-left space-y-3 mb-8 text-sm font-bold text-text-muted">
              <p className="flex gap-2">
                <span className="text-primary text-lg">✓</span>
                <span>Đấu giá tự do, không cần đặt cọc trước.</span>
              </p>
              <p className="flex gap-2">
                <span className="text-primary text-lg">✓</span>
                <span>Thanh toán trong vòng 30 phút sau khi thắng cuộc.</span>
              </p>
              <p className="flex gap-2 text-rose-500">
                <span className="text-lg">⚠</span>
                <span>
                  Phạt 10% giá trị thầu nếu trúng thầu mà không thanh toán.
                </span>
              </p>
            </div>
            <button
              onClick={() => store.agreeToLivePolicy()}
              className="btn-primary w-full py-4 rounded-2xl shadow-xl shadow-primary/20"
            >
              Tôi đồng ý và cam kết
            </button>
          </div>
        </div>
      )}

      {/* Winner Overlay */}
      {isFinished && product.status === "ended" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
          <div className="bg-white p-10 rounded-[40px] text-center max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-500 border-b-8 border-primary">
            <div className="text-6xl mb-6">{isUserWinner ? "🎊" : "😥"}</div>
            <h2
              className={`text-3xl font-black mb-4 ${isUserWinner ? "text-primary" : "text-text-main"}`}
            >
              {isUserWinner
                ? "Xác Nhận Trúng Thầu!"
                : "Phiên đấu giá đã kết thúc"}
            </h2>

            {isUserWinner ? (
              <div className="space-y-6">
                <p className="text-text-muted font-bold">
                  Chúc mừng bạn! Bạn đã thắng với giá{" "}
                  <span className="text-primary">
                    {formatPriceVN(product.currentPrice)}
                  </span>
                  . Vui lòng thanh toán trước khi hết hạn cam kết.
                </p>

                <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-rose-200/50">
                    <div className="text-left">
                      <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">
                        Số dư hiện tại
                      </div>
                      <div className="text-xl font-black text-rose-600">
                        {currentUser.balance.toLocaleString()}đ
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">
                        Giá trúng thầu
                      </div>
                      <div className="text-xl font-black text-rose-600">
                        {product.currentPrice.toLocaleString()}đ
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-black text-rose-500 uppercase tracking-widest mb-2">
                    Thời gian thanh toán còn lại
                  </div>
                  <div className="text-3xl font-black text-rose-600 tabular-nums">
                    30 phút
                  </div>

                  {currentUser.balance < product.currentPrice && (
                    <div className="mt-4 p-3 bg-white/50 rounded-2xl border border-rose-200 text-xs font-bold text-rose-600 animate-pulse">
                      ⚠️ Số dư của bạn không đủ. Vui lòng nạp thêm tiền để thanh
                      toán thầu.
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {currentUser.balance >= product.currentPrice ? (
                    <button
                      onClick={() => store.payAuction(product.id)}
                      className="btn-primary py-4 rounded-2xl shadow-lg shadow-primary/20"
                    >
                      Thanh toán ngay
                    </button>
                  ) : (
                    <button
                      onClick={() => (window.location.hash = "/profile")}
                      className="bg-primary text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                    >
                      Nạp tiền ngay
                    </button>
                  )}
                  <button
                    onClick={() => (window.location.href = "#/")}
                    className="bg-background text-text-main font-black py-4 rounded-2xl hover:bg-border-main transition-colors"
                  >
                    Để sau
                  </button>
                </div>

                <p className="text-[10px] text-text-muted font-bold italic">
                  * Vi phạm cam kết thanh toán sẽ bị trừ 10% số dư tài khoản.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-text-muted font-bold">
                  Sản phẩm đã về tay{" "}
                  <span className="text-secondary">{getLeaderName()}</span> với
                  giá {formatPriceVN(product.currentPrice)}.
                </p>
                <button
                  onClick={() => (window.location.href = "#/")}
                  className="btn-primary w-full py-4 rounded-2xl"
                >
                  Xem các phiên khác
                </button>
                <button
                  onClick={() => {
                    store.resetProduct(product.id);
                    window.location.reload();
                  }}
                  className="mt-4 text-text-muted font-bold hover:text-primary transition-colors text-xs"
                >
                  Thử lại phiên đấu giá (Reset)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Paid/Penalized Status Modal */}
      {isFinished &&
        product.paymentStatus &&
        product.paymentStatus !== "pending" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
            <div className="bg-white p-10 rounded-[40px] text-center max-w-md w-full shadow-2xl">
              <div className="text-6xl mb-6">
                {product.paymentStatus === "paid" ? "✅" : "❌"}
              </div>
              <h2 className="text-2xl font-black mb-4">
                {product.paymentStatus === "paid"
                  ? "Đã Thanh Toán"
                  : "Vi Phạm Cam Kết"}
              </h2>
              <p className="text-text-muted font-bold mb-8">
                {product.paymentStatus === "paid"
                  ? "Giao dịch đã được hoàn tất. Người bán sẽ sớm liên hệ với bạn."
                  : "Bạn đã quá thời hạn thanh toán và bị trừ 10% phí vi phạm cam kết."}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => (window.location.href = "#/")}
                  className="btn-primary w-full py-4 rounded-2xl"
                >
                  Quay về trang chủ
                </button>
                <button
                  onClick={() => {
                    store.resetProduct(product.id);
                    window.location.reload();
                  }}
                  className="text-text-muted font-bold hover:text-primary transition-colors text-xs"
                >
                  Thử lại phiên đấu giá (Reset)
                </button>
              </div>
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

          {/* Manual Bid Input */}
          <div>
            <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">
              Nhập giá tự do
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={manualBidAmount}
                onChange={(e) => setManualBidAmount(e.target.value)}
                placeholder={`Tối thiểu: ${formatPriceVN(product.currentPrice + 50000)}`}
                disabled={isFinished}
                className="flex-1 px-4 py-3 border border-border-main rounded-2xl font-bold text-text-main placeholder:text-text-muted disabled:opacity-40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                disabled={isFinished || !manualBidAmount}
                onClick={handleManualBid}
                className="px-4 py-3 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 disabled:opacity-40 transition-all active:scale-95"
              >
                Đặt
              </button>
            </div>
          </div>

          {/* Tabbed Section - Bid History / Comments / Chat */}
          <div className="glass-card flex flex-col overflow-hidden border-border-main shadow-sm">
            {/* Tab Navigation */}
            <div className="flex border-b border-border-main bg-background">
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 px-4 py-3 text-[11px] font-black uppercase tracking-wider transition-all ${
                  activeTab === "history"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                Trả giá
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`flex-1 px-4 py-3 text-[11px] font-black uppercase tracking-wider transition-all border-l border-border-main ${
                  activeTab === "comments"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                Bình luận
              </button>
            </div>

            {/* Bid History Tab */}
            {activeTab === "history" && (
              <div className="h-[400px] flex flex-col">
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
            )}

            {/* Comments Tab */}
            {activeTab === "comments" && (
              <div className="h-[400px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                  {comments.map((com) => (
                    <div
                      key={com.id}
                      className={`p-3 rounded-2xl border animate-in slide-in-from-bottom-2 fade-in ${
                        com.isMe
                          ? "bg-primary/5 border-primary/20"
                          : "bg-background border-border-main"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`font-black text-[11px] uppercase tracking-wider ${
                            com.isMe ? "text-primary" : "text-secondary"
                          }`}
                        >
                          {com.name}
                        </span>
                        <span className="text-[10px] font-bold text-text-muted">
                          {com.time}
                        </span>
                      </div>
                      <p
                        className={`text-[13px] font-medium break-words ${
                          com.isMe ? "text-text-main" : "text-text-main"
                        }`}
                      >
                        {com.comment}
                      </p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="border-t border-border-main p-3 flex gap-2 bg-background">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                    placeholder="Viết bình luận..."
                    disabled={isFinished}
                    className="flex-1 px-3 py-2 border border-border-main rounded-2xl text-[13px] text-black font-medium placeholder:text-text-muted disabled:opacity-40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={isFinished || !newComment.trim()}
                    className="px-4 py-2 bg-primary text-white font-black rounded-2xl text-[11px] hover:bg-primary/90 disabled:opacity-40 transition-all active:scale-95"
                  >
                    Gửi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
