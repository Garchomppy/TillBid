import React from "react";
import { Header } from "./components/Header";
import { NotificationToast } from "./components/NotificationToast";
import { HomeView } from "./pages/HomeView";
import { ProductDetailView } from "./pages/ProductDetailView";
import { PostItemView } from "./pages/PostItemView";
import { ProfileView } from "./pages/ProfileView";
import { LoginView } from "./pages/LoginView";
import { LiveAuctionView } from "./pages/LiveAuctionView";
import { FlashAuctionView } from "./pages/FlashAuctionView";
import { ShopProfileView } from "./pages/ShopProfileView";
import { BottomNavBar } from "./components/BottomNavBar";
import { useRouter } from "./hooks/useRouter";

const App: React.FC = () => {
  const { view, params } = useRouter();

  const renderContent = () => {
    switch (view) {
      case "home":
        return <HomeView />;
      case "product":
        return <ProductDetailView id={params.id} />;
      case "post":
        return <PostItemView />;
      case "profile":
        return <ProfileView />;
      case "login":
        return <LoginView />;
      case "live":
        return <LiveAuctionView />;
      case "flash":
        return <FlashAuctionView />;
      case "shop":
        return <ShopProfileView sellerId={params.id || "Unknown"} />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-black">
      <Header />
      <main className="min-h-[calc(100vh-80px)] pb-24 md:pb-0">
        {renderContent()}
      </main>
      <BottomNavBar />
      <NotificationToast />
    </div>
  );
};

export default App;
