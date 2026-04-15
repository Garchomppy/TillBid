import React, { useState } from "react";
import { store } from "../services/storeService";
import { router } from "../router/routerService";

const PRICE_SUGGESTIONS: Record<string, string> = {
  "Thời trang": "500.000đ",
  "Công nghệ": "2.000.000đ",
  "Mỹ phẩm": "300.000đ",
  "Túi xách": "1.500.000đ",
  "Giày dép": "800.000đ",
};

export const PostItemView: React.FC = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("Thời trang");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<number>(24);
  const [uploadStatus, setUploadStatus] = useState<"pending" | "success" | "error">("pending");
  
  // Specs fields
  const [specSize, setSpecSize] = useState("");
  const [specColor, setSpecColor] = useState("");
  const [specMeasure1, setSpecMeasure1] = useState("");
  const [specMeasure2, setSpecMeasure2] = useState("");
  const [specExtra1, setSpecExtra1] = useState("");
  const [specDefect, setSpecDefect] = useState("");
  const [condition, setCondition] = useState("Như mới (95%+)");

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    const id = store.postProduct({
      name,
      description,
      category,
      startPrice: price,
      durationHours: duration,
    });
    if (id) {
      router.navigate("product", { id });
    }
  };

  const handleUploadClick = () => {
    setUploadStatus("success");
    setTimeout(() => {
      setUploadStatus("pending");
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto pt-8 pb-32 lg:py-32 px-4 h-full">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-text-main mb-4">
            Đăng bán sản phẩm
          </h2>
          <p className="text-text-muted font-medium">
            Bán món đồ cũ của bạn với giá hời nhất thông qua đấu giá.
          </p>
        </div>

        <div className="glass-card p-12 bg-white/70 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full" />

          <form onSubmit={handlePost} className="space-y-10 relative z-10">
            {/* Image Upload Placeholder */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-2 pb-2 flex items-center gap-2">
                Ảnh / Video thật <span className="text-rose-500">*</span>
                </label>
              <div 
                onClick={handleUploadClick}
                className="group border-2 border-dashed border-border-main rounded-[32px] p-16 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer bg-background/50"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  {uploadStatus === "success" ? (
                    <svg
                      className="w-10 h-10 text-green-500 animate-in bounce-in"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-10 h-10 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </div>
                <div className="text-lg font-black text-text-main">
                  {uploadStatus === "success" ? "✓ Đã đăng tải thành công!" : "Tải ảnh/video lên"}
                </div>
                <p className="text-sm text-text-muted font-bold mt-2">
                  {uploadStatus === "success" ? "Video/ảnh đã sẵn sàng" : "Kéo thả hoặc nhấn để chọn (Tối đa 5 file)"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">
                  Tên sản phẩm
                </label>
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
                <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">
                  Danh mục
                </label>
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
                <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">
                  Giá khởi điểm (đ)
                </label>
                <input
                  type="number"
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="Nhập giá bạn muốn..."
                  className="w-full bg-background border border-border-main rounded-2xl px-6 py-4 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-black text-xl text-text-main"
                  required
                />
                <div className="text-[10px] text-primary font-black uppercase tracking-widest mt-3 px-2 italic flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-primary"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span>
                    Giá khởi điểm đề xuất cho sản phẩm này:{" "}
                    <span className="text-text-main">
                      {PRICE_SUGGESTIONS[category] || "500.000đ"}
                    </span>
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">
                  Thời gian đấu giá
                </label>
                <div className="flex bg-background p-1.5 rounded-2xl border border-border-main">
                  <button
                    type="button"
                    onClick={() => setDuration(24)}
                    className={`flex-1 py-3.5 rounded-[14px] text-[11px] font-black uppercase tracking-widest transition-all ${duration === 24 ? "bg-white text-primary shadow-md" : "text-text-muted hover:text-text-main"}`}
                  >
                    24 Giờ
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuration(48)}
                    className={`flex-1 py-3.5 rounded-[14px] text-[11px] font-black uppercase tracking-widest transition-all ${duration === 48 ? "bg-white text-primary shadow-md" : "text-text-muted hover:text-text-main"}`}
                  >
                    48 Giờ
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">
                Mô tả tình trạng{" "}
                <span className="text-rose-500">(Bắt buộc)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Mô tả chi tiết tình trạng, lỗi (nếu có), xuất xứ..."
                className="w-full bg-background border border-border-main rounded-[32px] px-8 py-6 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-text-main resize-none"
                required
              />
            </div>

            {/* Product Condition */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">
                Tình trạng
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setCondition("Như mới (95%+)")}
                  className={`relative p-6 rounded-3xl border-2 transition-all group ${
                    condition === "Như mới (95%+)"
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border-main bg-background hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-all ${
                      condition === "Như mới (95%+)"
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary group-hover:bg-primary/20"
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div
                    className={`text-sm font-black transition-all ${
                      condition === "Như mới (95%+)"
                        ? "text-text-main"
                        : "text-text-muted group-hover:text-text-main"
                    }`}
                  >
                    Như mới
                  </div>
                  <div
                    className={`text-[10px] font-bold transition-all ${
                      condition === "Như mới (95%+)"
                        ? "text-primary"
                        : "text-text-muted group-hover:text-primary"
                    }`}
                  >
                    95%+
                  </div>
                  {condition === "Như mới (95%+)" && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCondition("Tốt (80–95%)")}
                  className={`relative p-6 rounded-3xl border-2 transition-all group ${
                    condition === "Tốt (80–95%)"
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border-main bg-background hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-all ${
                      condition === "Tốt (80–95%)"
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary group-hover:bg-primary/20"
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.646 7.23a2 2 0 01-1.789 1.106H7a2 2 0 01-2-2v-8a2 2 0 012-2h5.236a2 2 0 011.789 2.894l-.356.708M7 20h10" />
                    </svg>
                  </div>
                  <div
                    className={`text-sm font-black transition-all ${
                      condition === "Tốt (80–95%)"
                        ? "text-text-main"
                        : "text-text-muted group-hover:text-text-main"
                    }`}
                  >
                    Tốt
                  </div>
                  <div
                    className={`text-[10px] font-bold transition-all ${
                      condition === "Tốt (80–95%)"
                        ? "text-primary"
                        : "text-text-muted group-hover:text-primary"
                    }`}
                  >
                    80–95%
                  </div>
                  {condition === "Tốt (80–95%)" && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setCondition("Khá (60–80%)")}
                  className={`relative p-6 rounded-3xl border-2 transition-all group ${
                    condition === "Khá (60–80%)"
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border-main bg-background hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-all ${
                      condition === "Khá (60–80%)"
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary group-hover:bg-primary/20"
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div
                    className={`text-sm font-black transition-all ${
                      condition === "Khá (60–80%)"
                        ? "text-text-main"
                        : "text-text-muted group-hover:text-text-main"
                    }`}
                  >
                    Khá
                  </div>
                  <div
                    className={`text-[10px] font-bold transition-all ${
                      condition === "Khá (60–80%)"
                        ? "text-primary"
                        : "text-text-muted group-hover:text-primary"
                    }`}
                  >
                    60–80%
                  </div>
                  {condition === "Khá (60–80%)" && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Detailed Specs */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] ml-2 pb-2 flex items-center gap-2">
                Bảng thông số chi tiết <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Kích cỡ / Model"
                  value={specSize}
                  onChange={(e) => setSpecSize(e.target.value)}
                  className="w-full bg-background border border-border-main rounded-2xl px-6 py-4 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-text-main"
                />
                <input
                  type="text"
                  placeholder="Màu sắc"
                  value={specColor}
                  onChange={(e) => setSpecColor(e.target.value)}
                  className="w-full bg-background border border-border-main rounded-2xl px-6 py-4 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-text-main"
                />
                <input
                  type="text"
                  placeholder="Vòng ngực / Dung lượng (cm/GB)"
                  value={specMeasure1}
                  onChange={(e) => setSpecMeasure1(e.target.value)}
                  className="w-full bg-background border border-border-main rounded-2xl px-6 py-4 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-text-main"
                />
                <input
                  type="text"
                  placeholder="Vòng eo / Tình trạng pin (%)"
                  value={specMeasure2}
                  onChange={(e) => setSpecMeasure2(e.target.value)}
                  className="w-full bg-background border border-border-main rounded-2xl px-6 py-4 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-text-main"
                />
                <input
                  type="text"
                  placeholder="Chiều dài / Phụ kiện kèm theo"
                  value={specExtra1}
                  onChange={(e) => setSpecExtra1(e.target.value)}
                  className="w-full bg-background border border-border-main rounded-2xl px-6 py-4 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-text-main"
                />
                <input
                  type="text"
                  placeholder="Lỗi / Hao mòn (nếu có)"
                  value={specDefect}
                  onChange={(e) => setSpecDefect(e.target.value)}
                  className="w-full bg-background border border-border-main rounded-2xl px-6 py-4 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold text-text-main"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-5 text-lg font-black shadow-2xl shadow-primary/20 flex items-center justify-center gap-4"
            >
              Đăng đấu giá ngay
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
