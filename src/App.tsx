import React from "react";
import { router } from "./router";
import { Header } from "./components/Header";
import { NotificationToast } from "./components/NotificationToast";
import { HomeView } from "./components/views/HomeView";
import { ProductDetailView } from "./components/views/ProductDetailView";
import { PostItemView } from "./components/views/PostItemView";
import { ProfileView } from "./components/views/ProfileView";
import { LoginView } from "./components/views/LoginView";
import { LiveAuctionView } from "./components/views/LiveAuctionView";
import { FlashAuctionView } from "./components/views/FlashAuctionView";
import { ShopProfileView } from "./components/views/ShopProfileView";
import { BottomNavBar } from "./components/BottomNavBar";

const App: React.FC = () => {
  const { view, params } = router.useRouter();

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
