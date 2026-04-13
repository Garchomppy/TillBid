import React, { useState } from "react";
import { useStore } from "../hooks/useStore";
import { store } from "../services/storeService";
import { VerifiedBadge } from "../components/VerifiedBadge";
import { Modal } from "../components/Modal";
import { DeliveryModal } from "../components/DeliveryModal";
import type { DeliveryData } from "../components/DeliveryModal";

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

  // Delivery Flow States
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  if (!currentUser) return null;

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

  const handleDeliveryConfirm = (_data: DeliveryData) => {
    store.addNotification(
      `Thông tin nhận hàng cho "${selectedTx?.title || "Sản phẩm"}" đã được ghi nhận. Đang chuẩn bị giao hàng!`,
      "success",
    );
    setIsDeliveryOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-32 px-4 h-full">
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
              <div className="glass-card p-10">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black text-text-main">
                    Lịch sử giao dịch
                  </h3>
                  <button className="text-[11px] font-black uppercase text-primary hover:underline">
                    Tải sao kê
                  </button>
                </div>
                <div className="space-y-6">
                  {transactions.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-border-main rounded-[32px]">
                      <div className="text-4xl mb-4">📜</div>
                      <div className="font-black text-text-muted uppercase text-[10px] tracking-widest">
                        Chưa có giao dịch nào
                      </div>
                    </div>
                  ) : (
                    transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[24px] bg-background border border-border-main hover:border-primary/20 transition-all group"
                      >
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0 ${tx.status === "disbursed" ? "bg-green-100 text-green-600" : "bg-secondary/10 text-secondary animate-pulse"}`}
                        >
                          {tx.icon || (tx.status === "disbursed" ? "💰" : "🔒")}
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
                                ? " Hoàn tiền khả dụng"
                                : " Đang đóng băng"}
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
                          {tx.status === "frozen" &&
                            tx.buyerId === currentUser.id && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedTx(tx);
                                    setIsDeliveryOpen(true);
                                  }}
                                  className="bg-secondary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                  Điền đơn hàng
                                </button>
                                <button
                                  onClick={() => store.confirmReceipt(tx.id)}
                                  className="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                  Xác nhận đã nhận hàng
                                </button>
                              </div>
                            )}
                        </div>
                      </div>
                    ))
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
        <div className="space-y-8">
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
          <button
            onClick={handleDeposit}
            className="btn-primary w-full py-6 text-lg font-black shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
          >
            Xác nhận nạp tiền
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
