import React, { useState } from "react";
import { useStore } from "../hooks/useStore";
import { store } from "../services/storeService";
import { VerifiedBadge } from "../components/VerifiedBadge";
import { Modal } from "../components/Modal";
import { DeliveryModal } from "../components/DeliveryModal";
import type { DeliveryData } from "../components/DeliveryModal";
import { Pagination } from "../components/Pagination";

export const ProfileView: React.FC = () => {
  const { currentUser, transactions } = useStore();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idPhotos, setIdPhotos] = useState<{
    front: string | null;
    back: string | null;
  }>({ front: null, back: null });

  // Wallet Modal States
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [walletAmount, setWalletAmount] = useState<number>(0);
  const [selectedBank, setSelectedBank] = useState<string>("Vietcombank");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "momo" | "card">(
    "bank",
  );

  // Delivery Flow States
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  if (!currentUser) return null;

  // Filter and Sort Transactions
  const userTransactions = transactions
    .filter(
      (tx) =>
        tx.buyerId === currentUser.id ||
        tx.sellerId === currentUser.id ||
        tx.sellerId === currentUser.name,
    )
    .sort((a, b) => b.timestamp - a.timestamp);

  const totalPages = Math.max(
    1,
    Math.ceil(userTransactions.length / transactionsPerPage),
  );
  const paginatedTransactions = userTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage,
  );

  const handleFileUpload = (side: "front" | "back") => {
    setIdPhotos((prev) => ({ ...prev, [side]: "uploaded" }));
  };

  const handleVerifySubmit = () => {
    if (!idPhotos.front || !idPhotos.back) return;
    setIsSubmitting(true);
    setTimeout(() => {
      store.verifyUser();
      setIsSubmitting(false);
      setIsVerifying(false);
    }, 2500);
  };

  const handleDeposit = () => {
    if (walletAmount <= 0) return;
    store.deposit(walletAmount);

    const methodName =
      paymentMethod === "momo"
        ? "Momo"
        : paymentMethod === "card"
          ? "Thẻ Visa/Mastercard"
          : "Chuyển khoản ngân hàng";

    store.addNotification(
      `Đã ghi nhận yêu cầu nạp ${walletAmount.toLocaleString()}đ qua ${methodName}.`,
      "success",
    );

    setIsDepositOpen(false);
    setWalletAmount(0);
  };

  const handleWithdraw = () => {
    if (walletAmount <= 0) return;
    if (!accountNumber) {
      store.addNotification("Vui lòng nhập số tài khoản!", "warning");
      return;
    }
    if (walletAmount > currentUser.balance) {
      store.addNotification("Số dư không đủ!", "warning");
      return;
    }
    store.withdraw(walletAmount);
    store.addNotification(
      `Lệnh rút về ${selectedBank} (${accountNumber}) đang được xử lý.`,
      "info",
    );
    setIsWithdrawOpen(false);
    setWalletAmount(0);
    setAccountNumber("");
  };

  const handleDeliveryConfirm = (data: DeliveryData) => {
    if (!selectedTx) return;
    store.updateTransactionShippingInfo(selectedTx.id, data);
    setIsDeliveryOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto pt-8 pb-32 lg:py-32 px-4 h-full">
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
              {currentUser.isVerified && <VerifiedBadge size="w-7 h-7" />}
            </h2>
            <p className="text-text-muted font-bold text-sm mb-8">
              {currentUser.email}
            </p>

            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <div className="bg-white/60 p-4 rounded-2xl border border-border-main text-center">
                <div className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">
                  Đã mua
                </div>
                <div className="text-xl font-black text-text-main">14</div>
              </div>
              <div className="bg-white/60 p-4 rounded-2xl border border-border-main text-center">
                <div className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">
                  Đánh giá
                </div>
                <div className="text-xl font-black text-primary">5.0</div>
              </div>
            </div>

            {!currentUser.isVerified && !isVerifying && (
              <button
                onClick={() => setIsVerifying(true)}
                className="bg-secondary text-white w-full py-4 rounded-2xl font-black text-[13px] tracking-widest uppercase hover:bg-secondary/90 shadow-xl transition-all"
              >
                Xác minh ngay
              </button>
            )}

            {currentUser.isVerified && (
              <div className="bg-blue-50 text-blue-600 border border-blue-100 w-full py-4 rounded-2xl font-black text-[11px] tracking-widest uppercase flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Đã xác minh danh tính
              </div>
            )}

            <button
              onClick={() => store.logout()}
              className="bg-background text-rose-500 border border-border-main w-full py-4 rounded-2xl font-black text-[13px] tracking-widest uppercase hover:bg-rose-50 hover:border-rose-200 transition-all mt-4 flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Wallet & History section or Verification Form */}
        <div className="lg:col-span-2 space-y-10">
          {isVerifying && !currentUser.isVerified ? (
            <div className="glass-card p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-3xl font-black text-text-main mb-2">
                    Xác minh tài khoản
                  </h3>
                  <p className="text-text-muted font-bold text-sm">
                    Vui lòng tải lên ảnh CCCD để nhận Tick xanh và tăng hạn mức
                    giao dịch.
                  </p>
                </div>
                <button
                  onClick={() => setIsVerifying(false)}
                  className="p-3 bg-background border border-border-main rounded-2xl text-text-muted hover:text-rose-500 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
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

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div
                  onClick={() => handleFileUpload("front")}
                  className={`relative group cursor-pointer border-2 border-dashed rounded-[32px] p-8 transition-all h-60 flex flex-col items-center justify-center text-center ${idPhotos.front ? "border-secondary bg-secondary/5" : "border-border-main hover:border-primary/50 hover:bg-primary/5"}`}
                >
                  {idPhotos.front ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center text-secondary">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="font-black text-secondary">
                        Mặt trước đã tải lên
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center text-text-muted">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div className="font-black text-text-main">
                        Mặt trước CCCD
                      </div>
                    </div>
                  )}
                </div>
                <div
                  onClick={() => handleFileUpload("back")}
                  className={`relative group cursor-pointer border-2 border-dashed rounded-[32px] p-8 transition-all h-60 flex flex-col items-center justify-center text-center ${idPhotos.back ? "border-secondary bg-secondary/5" : "border-border-main hover:border-primary/50 hover:bg-primary/5"}`}
                >
                  {idPhotos.back ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center text-secondary">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="font-black text-secondary">
                        Mặt sau đã tải lên
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center text-text-muted">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div className="font-black text-text-main">
                        Mặt sau CCCD
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleVerifySubmit}
                disabled={!idPhotos.front || !idPhotos.back || isSubmitting}
                className={`w-full py-6 rounded-3xl font-black text-sm uppercase transition-all flex items-center justify-center gap-3 ${!idPhotos.front || !idPhotos.back || isSubmitting ? "bg-background text-text-muted cursor-not-allowed border border-border-main" : "bg-primary text-white shadow-2xl"}`}
              >
                {isSubmitting ? "Đang xác thực AI..." : "Gửi hồ sơ xác minh"}
              </button>
            </div>
          ) : (
            <>
              {/* Wallet Card */}
              <div className="bg-text-main rounded-[40px] p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 blur-[100px] rounded-full group-hover:bg-secondary/20 transition-all" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <div className="text-xs font-black text-white/60 uppercase tracking-widest mb-2">
                        Số dư TillBid Wallet
                      </div>
                      <div className="text-5xl font-black tracking-tighter">
                        {currentUser.balance.toLocaleString()}đ
                      </div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-[24px] backdrop-blur-xl border border-white/20">
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => {
                        setIsDepositOpen(true);
                        setWalletAmount(500000);
                      }}
                      className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-primary/20"
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Nạp tiền
                    </button>
                    <button
                      onClick={() => {
                        setIsWithdrawOpen(true);
                        setWalletAmount(200000);
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all backdrop-blur-xl border border-white/20"
                    >
                      <svg
                        className="w-5 h-5 text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
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
                      Rút về ngân hàng
                    </button>
                  </div>

                  <div className="mt-12 flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <svg
                      className="w-5 h-5 text-secondary animate-pulse"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <div className="text-[13px] font-bold">
                      Số dư đang đóng băng (Escrow):{" "}
                      <span className="text-secondary">
                        {currentUser.frozenBalance.toLocaleString()}đ
                      </span>
                      <div className="text-[10px] text-white/40 font-normal mt-1 italic">
                        * Tổng tiền cọc từ các phiên bạn đang dẫn đầu
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div id="transaction-history" className="glass-card p-10">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black text-text-main">
                    Lịch sử giao dịch
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Bạn có chắc muốn xóa toàn bộ lịch sử giao dịch? Hành động này không thể hoàn tác.",
                          )
                        ) {
                          store.clearTransactions();
                        }
                      }}
                      className="text-[11px] font-black uppercase text-rose-500 hover:underline"
                    >
                      Xóa lịch sử
                    </button>
                    <button className="text-[11px] font-black uppercase text-primary hover:underline">
                      Tải sao kê
                    </button>
                  </div>
                </div>

                {/* Escrow Explanation */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8">
                  <div className="font-black text-primary text-[11px] uppercase tracking-widest mb-2">
                    💡 Cách hoạt động ví trung gian
                  </div>
                  <div className="text-sm text-text-main space-y-2">
                    <p>
                      <strong>Khi đấu giá thành công:</strong> Tiền cọc tạm thời
                      đóng băng trong ví (chưa trừ)
                    </p>
                    <p>
                      <strong>Khi xác nhận nhận hàng:</strong> Tiền sẽ bị trừ từ
                      ví và chuyển đến người bán
                    </p>
                    <p>
                      <strong>Nếu không xác nhận:</strong> Tiền quay lại ví khả
                      dụng sau 7 ngày
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {paginatedTransactions.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-border-main rounded-[32px]">
                      <div className="text-4xl mb-4">📜</div>
                      <div className="font-black text-text-muted uppercase text-[10px] tracking-widest">
                        Chưa có giao dịch nào
                      </div>
                    </div>
                  ) : (
                    <>
                      {paginatedTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[24px] bg-background border border-border-main hover:border-primary/20 transition-all group"
                        >
                          <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0 ${tx.status === "disbursed" ? "bg-green-100 text-green-600" : "bg-secondary/10 text-secondary animate-pulse"}`}
                          >
                            {tx.icon ||
                              (tx.status === "disbursed" ? "💰" : "🔒")}
                          </div>
                          <div className="flex-1">
                            <div className="font-black text-text-main group-hover:text-primary transition-colors">
                              {tx.title || "Giao dịch TillBid"}
                            </div>
                            <div className="text-xs font-bold text-text-muted mt-1 uppercase tracking-wider">
                              {new Date(tx.timestamp).toLocaleDateString()} ·{" "}
                              <span
                                className={
                                  tx.status === "disbursed"
                                    ? "text-green-500"
                                    : "text-secondary"
                                }
                              >
                                {tx.status === "disbursed"
                                  ? "✓ Đã chuyển cho người bán"
                                  : tx.status === "pending_payment"
                                    ? "⚠️ Đang chờ thanh toán (Hạn chót: 30 phút)"
                                    : "🔒 Đang chờ xác nhận nhận hàng"}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <div
                              className={`text-xl font-black ${tx.status === "disbursed" ? "text-green-500" : "text-secondary"}`}
                            >
                              {tx.status === "disbursed" ? "+" : "-"}
                              {tx.amount.toLocaleString()}đ
                            </div>
                            {tx.status === "pending_payment" &&
                              tx.buyerId === currentUser.id && (
                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Xác nhận thanh toán ${tx.amount.toLocaleString()}đ cho ${tx.title}?`,
                                      )
                                    ) {
                                      store.payAuction(tx.productId);
                                    }
                                  }}
                                  className="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all animate-pulse"
                                >
                                  💸 Thanh toán ngay
                                </button>
                              )}

                            {tx.status === "frozen" &&
                              tx.buyerId === currentUser.id && (
                                <>
                                  {!tx.shippingInfo ? (
                                    <button
                                      onClick={() => {
                                        setSelectedTx(tx);
                                        setIsDeliveryOpen(true);
                                      }}
                                      className="bg-secondary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                      Nhập thông tin giao hàng
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            "Bạn xác nhận đã nhận được hàng và đồng ý giải ngân tiền từ số dư đang đóng băng cho người bán?",
                                          )
                                        ) {
                                          store.confirmReceipt(tx.id);
                                        }
                                      }}
                                      className="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                      ✓ Xác nhận nhận hàng
                                    </button>
                                  )}
                                </>
                              )}
                          </div>
                        </div>
                      ))}

                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                          setCurrentPage(page);
                          // Optional: Scroll to top of transaction list
                          document
                            .getElementById("transaction-history")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        title="Nạp tiền vào ví"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2 block">
              Nhập số tiền muốn nạp
            </label>
            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-text-muted">
                đ
              </div>
              <input
                type="number"
                value={walletAmount}
                onChange={(e) => setWalletAmount(Number(e.target.value))}
                className="w-full bg-background border-2 border-border-main rounded-[24px] pl-14 pr-8 py-6 text-3xl text-black font-black outline-none focus:border-primary transition-all"
                placeholder="0"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[100000, 500000, 1000000, 2000000, 5000000, 10000000].map(
                (amt) => (
                  <button
                    key={amt}
                    onClick={() => setWalletAmount(amt)}
                    className={`py-4 rounded-2xl text-[11px] font-black border transition-all ${walletAmount === amt ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white border-border-main text-text-main hover:border-primary hover:text-primary"}`}
                  >
                    {amt >= 1000000 ? `${amt / 1000000}M` : `${amt / 1000}K`}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2 block">
              Chọn phương thức thanh toán
            </label>
            <div className="grid grid-cols-3 gap-3 text-black">
              <button
                onClick={() => setPaymentMethod("momo")}
                className={`p-5 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 text-center group ${paymentMethod === "momo" ? "border-[#A50064] bg-[#A50064]/5 shadow-xl shadow-[#A50064]/10" : "border-border-main hover:border-[#A50064]/30 bg-white"}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${paymentMethod === "momo" ? "bg-[#A50064] text-white" : "bg-background text-[#A50064]"}`}
                >
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <circle cx="12" cy="12" r="5" />
                  </svg>
                </div>
                <div className="font-black text-[12px] uppercase tracking-tighter">
                  Ví Momo
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("bank")}
                className={`p-5 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 text-center group ${paymentMethod === "bank" ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-border-main hover:border-primary/30 bg-white"}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${paymentMethod === "bank" ? "bg-primary text-white" : "bg-background text-primary"}`}
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="font-black text-[12px] uppercase tracking-tighter">
                  Chuyển khoản
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-5 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 text-center group ${paymentMethod === "card" ? "border-text-main bg-text-main text-white shadow-xl shadow-text-main/10" : "border-border-main hover:border-text-main/30 bg-white"}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${paymentMethod === "card" ? "bg-white text-text-main" : "bg-background text-text-main"}`}
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div className="font-black text-[10px] md:text-[12px] uppercase tracking-tighter">
                  Visa/Master
                </div>
              </button>
            </div>
          </div>

          {(paymentMethod === "momo" || paymentMethod === "bank") &&
            walletAmount > 0 && (
              <div className="bg-background border border-border-main rounded-[24px] p-6 animate-in zoom-in-95 duration-300">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-32 h-32 bg-white p-2 rounded-2xl border-2 border-border-main flex-shrink-0 relative group">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT_FOR_TILLBID_${walletAmount}`}
                      className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                      alt="QR Payment"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all rounded-2xl">
                      <span className="text-[10px] font-black uppercase text-primary">
                        Scan to Pay
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="text-[11px] font-black text-text-muted uppercase tracking-widest">
                      Quét mã để thanh toán
                    </div>
                    <div className="text-xl font-black text-text-main">
                      {paymentMethod === "momo"
                        ? "VÍ MOMO: 0987******"
                        : "STK: 123456789 (Vietcombank)"}
                    </div>
                    <div className="p-3 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="text-[10px] font-black text-primary uppercase mb-1">
                        Nội dung chuyển khoản
                      </div>
                      <div className="font-mono font-bold text-text-main flex items-center justify-between">
                        <span>TILLBID {currentUser.id.toUpperCase()}</span>
                        <button className="text-[10px] text-primary hover:underline">
                          COPY
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-2 text-[10px] text-text-muted italic bg-white/50 p-3 rounded-xl">
                  <svg
                    className="w-4 h-4 text-secondary flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Hệ thống sẽ tự động duyệt tiền sau 1-3 phút khi nhận được giao
                  dịch.
                </div>
              </div>
            )}

          {paymentMethod === "card" && walletAmount > 0 && (
            <div className="bg-text-main rounded-[24px] p-6 text-white space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-start">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">
                  Thông tin thẻ thanh toán
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-5 bg-white/20 rounded-md" />
                  <div className="w-8 h-5 bg-white/20 rounded-md" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="form-group">
                  <input
                    type="text"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 outline-none focus:border-white/50 transition-all font-mono"
                    placeholder="Số thẻ (Card Number)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 outline-none focus:border-white/50 transition-all font-mono"
                    placeholder="MM/YY"
                  />
                  <input
                    type="password"
                    className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 outline-none focus:border-white/50 transition-all font-mono"
                    placeholder="CVV"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleDeposit}
            disabled={walletAmount <= 0}
            className={`w-full py-6 text-lg font-black shadow-2xl flex items-center justify-center gap-3 rounded-[24px] transition-all ${walletAmount <= 0 ? "bg-background text-text-muted cursor-not-allowed" : "btn-primary shadow-primary/20"}`}
          >
            {walletAmount > 0
              ? `Xác nhận nạp ${walletAmount.toLocaleString()}đ`
              : "Nhập số tiền để tiếp tục"}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        title="Rút tiền về ngân hàng"
      >
        <div className="space-y-6">
          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
            <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
              Số dư khả dụng
            </div>
            <div className="text-2xl font-black text-text-main">
              {currentUser.balance.toLocaleString()}đ
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2 mb-2 block">
                Ngân hàng
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full bg-background border-2 border-border-main rounded-2xl px-6 py-4 font-bold text-text-main outline-none focus:border-primary transition-all"
              >
                <option>Vietcombank</option>
                <option>Techcombank</option>
                <option>MB Bank</option>
                <option>BIDV</option>
              </select>
            </div>
            <div className="form-group">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2 mb-2 block">
                Số tài khoản
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-background border-2 border-border-main rounded-2xl px-6 py-4 font-bold text-text-main outline-none focus:border-primary transition-all"
                placeholder="Nhập STK..."
              />
            </div>
          </div>
          <div className="form-group">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2 mb-2 block">
              Số tiền rút
            </label>
            <input
              type="number"
              value={walletAmount}
              onChange={(e) => setWalletAmount(Number(e.target.value))}
              className="w-full bg-background border-2 border-border-main rounded-[24px] px-8 py-5 text-2xl text-black font-black outline-none focus:border-primary transition-all"
              placeholder="0"
            />
          </div>
          <button
            onClick={handleWithdraw}
            className="btn-secondary w-full py-6 text-lg font-black shadow-2xl shadow-secondary/20 flex items-center justify-center gap-3"
          >
            Xác nhận rút tiền
          </button>
        </div>
      </Modal>

      <DeliveryModal
        isOpen={isDeliveryOpen}
        onClose={() => setIsDeliveryOpen(false)}
        onConfirm={handleDeliveryConfirm}
        productName={selectedTx?.title || "Sản phẩm"}
      />
    </div>
  );
};
