import React from "react";
import { router } from "../router/routerService";
import { useRouter } from "../hooks/useRouter";

export const BottomNavBar: React.FC = () => {
  const { view } = useRouter();

  const navItems = [
    {
      id: "home",
      label: "Trang chủ",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: "live",
      label: "Trực tiếp",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10l4.553 2.276A1 1 0 0120 13.17V17a1 1 0 01-.447.894L15 20.236M15 10V20.236M15 10l-4.553-2.276A1 1 0 0010 8.83V16a1 1 0 00.447.894L15 20.236M4 16.5L12 21l8-4.5M4 12l8 4.5 8-4.5M4 7.5L12 12l8-4.5"
          />
        </svg>
      ),
    },
    {
      id: "post",
      label: "Đăng tin",
      icon: (
        <div className="w-14 h-14 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center -mt-8 shadow-xl shadow-primary/40 border-4 border-background transition-transform hover:scale-110 active:scale-95 text-white">
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
        </div>
      ),
    },
    {
      id: "inbox",
      label: "Tin nhắn",
      icon: (
        <div className="relative">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-background"></span>
        </div>
      ),
    },
    {
      id: "profile",
      label: "Cá nhân",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
      <div className="glass-card !overflow-visible flex items-center justify-around px-2 py-3 shadow-2xl border-white/20">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              item.id !== "inbox" && router.navigate(item.id as any)
            }
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${
              view === item.id || (item.id === "post" && view === "post")
                ? "text-primary scale-110"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            {item.icon}
            {item.id !== "post" && (
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
