import React from "react";
import { useStore, store } from "../store";
import { router } from "../router";

export const Header: React.FC = () => {
  const { currentUser } = useStore();

  return (
    <header className="fixed top-4 left-4 right-4 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 bg-white/80 backdrop-blur-2xl border border-border-main shadow-[0_8px_32px_rgba(236,72,153,0.06)] rounded-full flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => router.navigate("home")}
          className="text-xl font-black cursor-pointer flex items-center gap-2 group shrink-0"
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="bg-gradient-to-r from-text-main to-primary bg-clip-text text-transparent">
            TillBid
          </span>
        </div>

        {/* Search Bar - Center */}
        <div className="hidden md:flex flex-1 max-w-md relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm đồ độc lạ..."
            className="w-full bg-background border border-border-main rounded-full py-2 pl-10 pr-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-text-main"
          />
        </div>

        {/* Navigation & User */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-extrabold uppercase tracking-tight text-text-muted">
            <button
              onClick={() => router.navigate("flash")}
              className="hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <svg
                className="w-4 h-4 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Flash
            </button>
            <button
              onClick={() => router.navigate("live")}
              className="hover:text-rose-500 transition-colors flex items-center gap-1.5"
            >
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              Live
            </button>
          </nav>

          <button
            onClick={() => router.navigate("post")}
            className="hidden sm:flex btn-primary !py-2 !px-5 text-xs font-black whitespace-nowrap gap-2 items-center"
          >
            <svg
              className="w-3.5 h-3.5"
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
            Đăng bán
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                onClick={() => router.navigate("profile")}
                className="cursor-pointer text-right hidden sm:block"
              >
                <div className="text-[9px] font-black uppercase text-text-muted leading-none tracking-widest">
                  Ví của tôi
                </div>
                <div className="text-[13px] font-black text-secondary">
                  {currentUser.balance.toLocaleString()}đ
                </div>
              </div>
              <div className="group relative">
                <img
                  onClick={() => router.navigate("profile")}
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full border-2 border-border-main cursor-pointer group-hover:border-primary group-hover:scale-105 transition-all p-0.5 object-cover"
                />
              </div>
              <button
                onClick={() => store.logout()}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-background hover:bg-rose-50 text-text-muted hover:text-rose-500 border border-border-main hover:border-rose-200 transition-all cursor-pointer"
                title="Đăng xuất"
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
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.navigate("login")}
              className="bg-text-main text-white hover:bg-primary px-5 py-2 rounded-full text-xs font-black transition-all cursor-pointer"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
