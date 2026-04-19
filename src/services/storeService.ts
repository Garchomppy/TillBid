import type {
  AppState,
  User,
  Product,
  SellerReview,
  Transaction,
} from "../types";
import { GET_INITIAL_STATE } from "../data/initialState";

class Store {
  private state: AppState = {
    currentUser: null,
    products: [],
    transactions: [],
    notifications: [],
    sellerReviews: [],
  };

  private listeners: (() => void)[] = [];

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    const saved = localStorage.getItem("tillbid_state_v6");
    if (saved) {
      const parsed = JSON.parse(saved);
      this.state = {
        ...parsed,
        sellerReviews: parsed.sellerReviews || [],
      };
    } else {
      this.state = GET_INITIAL_STATE();
      this.save();
    }
  }

  private save() {
    localStorage.setItem("tillbid_state_v6", JSON.stringify(this.state));
    this.notify();
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  subscribe = (listener: () => void) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };

  getState = () => {
    return this.state;
  };

  verifyUser() {
    if (this.state.currentUser) {
      this.state = {
        ...this.state,
        currentUser: { ...this.state.currentUser, isVerified: true },
      };
      this.addNotification("Xác minh danh tính thành công!", "success");
      this.save();
    }
  }

  agreeToLivePolicy() {
    if (this.state.currentUser) {
      this.state = {
        ...this.state,
        currentUser: { ...this.state.currentUser, hasAgreedToLivePolicy: true },
      };
      this.addNotification(
        "Bạn đã chấp nhận chính sách đấu giá Live.",
        "success",
      );
      this.save();
    }
  }

  logout() {
    this.state = {
      ...this.state,
      currentUser: null,
    };
    this.addNotification("Logged out successfully.", "info");
    this.save();
  }

  login(email: string, _pass: string) {
    const user: User = {
      id: "u1",
      name: email === "kien@example.com" ? "Kien Nguyen" : email.split("@")[0],
      email: email,
      balance: 2500000,
      frozenBalance: 500000,
      isVerified: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      productsWon: [],
      productsSelling: [],
    };

    this.state = {
      ...this.state,
      currentUser: user,
    };
    this.save();
    return true;
  }

  register(name: string, email: string) {
    const user: User = {
      id: "u" + Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      balance: 1000000,
      frozenBalance: 0,
      isVerified: false,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      productsWon: [],
      productsSelling: [],
    };

    this.state = {
      ...this.state,
      currentUser: user,
    };
    this.save();
    return true;
  }

  placeBid(productId: string, amount: number) {
    const user = this.state.currentUser;
    if (!user) return;

    const productIndex = this.state.products.findIndex(
      (p) => p.id === productId,
    );
    if (productIndex === -1) return;

    const product = this.state.products[productIndex];

    // LIVE LOGIC: No escrow, just check policy
    if (product.isLive) {
      if (!user.hasAgreedToLivePolicy) {
        throw new Error(
          "Bạn cần chấp nhận chính sách đấu giá Live trước khi đặt giá.",
        );
      }
    } else {
      // REGULAR LOGIC: Check balance
      if (user.balance < amount) {
        this.addNotification(
          `Số dư ví không đủ! Cần thêm ${(amount - user.balance).toLocaleString()}đ`,
          "warning",
        );
        return;
      }
    }

    if (amount <= product.currentPrice) {
      this.addNotification("Giá thầu phải cao hơn giá hiện tại", "warning");
      return;
    }

    if (product.sellerId === user.id || product.sellerId === user.name) {
      this.addNotification(
        "Bạn không thể đấu giá sản phẩm của chính mình!",
        "warning",
      );
      return;
    }

    let newState = { ...this.state };
    let newTransactions = [...this.state.transactions];

    // ESCROW LOGIC (Only for Regular Auctions)
    if (!product.isLive) {
      // 1. REFUND PREVIOUS BIDDER (Only if outbidding themselves or if we need to release old hold)
      // Note: Real world would refund the OTHER previous bidder, but this mock simplifies for current user.
      if (product.highestBidderId === user.id) {
        const updatedUser = { ...newState.currentUser! };
        updatedUser.balance += product.currentPrice;
        updatedUser.frozenBalance -= product.currentPrice;
        newState.currentUser = updatedUser;

        newTransactions.push({
          id: "t_ref_" + Math.random().toString(36).substr(2, 9),
          productId: product.id,
          buyerId: user.id,
          sellerId: product.sellerId,
          amount: product.currentPrice,
          status: "disbursed" as const,
          timestamp: Date.now(),
          title: `Hoàn tiền cọc (Nâng giá) – ${product.name}`,
          icon: "🔄",
        });
      }

      // 2. DEPOSIT NEW BID
      const finalUser = { ...(newState.currentUser || user) };
      finalUser.balance -= amount;
      finalUser.frozenBalance += amount;
      newState.currentUser = finalUser;

      newTransactions.push({
        id: "t_dep_" + Math.random().toString(36).substr(2, 9),
        productId: product.id,
        buyerId: user.id,
        sellerId: product.sellerId,
        amount: amount,
        status: "frozen" as const,
        timestamp: Date.now(),
        title: `Đặt cọc đấu giá – ${product.name}`,
        icon: "🔒",
      });
    } else {
      // LIVE AUCTION: Absolutely no wallet/escrow interaction during bidding.
      // We explicitly reset any changes to currentUser to be safe.
      newState.currentUser = this.state.currentUser;
      newTransactions = this.state.transactions;
    }

    // 3. UPDATE PRODUCT
    const newProducts = [...this.state.products];
    newProducts[productIndex] = {
      ...product,
      currentPrice: amount,
      highestBidderId: user.id,
    };

    this.state = {
      ...newState,
      products: newProducts,
      transactions: newTransactions,
    };

    this.addNotification(
      product.isLive
        ? `Đặt giá ${amount.toLocaleString()}đ thành công cho ${product.name} (Live)!`
        : `Đặt cọc ${amount.toLocaleString()}đ thành công cho ${product.name}!`,
      "success",
    );
    this.save();
  }

  placeBotBid(productId: string, botName: string, newPrice: number) {
    const productIndex = this.state.products.findIndex(
      (p) => p.id === productId,
    );
    if (productIndex === -1) return;

    const product = this.state.products[productIndex];
    if (newPrice <= product.currentPrice) return;

    const oldPrice = product.currentPrice;
    const prevBidderId = product.highestBidderId;

    const newProducts = [...this.state.products];
    newProducts[productIndex] = {
      ...product,
      currentPrice: newPrice,
      highestBidderId: "mock_" + botName,
    };

    let newUserState = this.state.currentUser;
    let newTransactions = this.state.transactions;
    let hasRefund = false;

    if (!product.isLive && prevBidderId === newUserState?.id) {
      newUserState = {
        ...newUserState,
        balance: newUserState.balance + oldPrice,
        frozenBalance: newUserState.frozenBalance - oldPrice,
      };

      const refundTx = {
        id: "t_ref_bot_" + Math.random().toString(36).substr(2, 9),
        productId: product.id,
        buyerId: newUserState.id,
        sellerId: product.sellerId,
        amount: oldPrice,
        status: "disbursed" as const,
        timestamp: Date.now(),
        title: `Hoàn tiền: Bị vượt giá – ${product.name}`,
        icon: "💰",
      };
      newTransactions = [refundTx, ...newTransactions];
      hasRefund = true;
    }

    this.state = {
      ...this.state,
      products: newProducts,
      currentUser: newUserState,
      transactions: newTransactions,
    };

    if (hasRefund) {
      this.addNotification(
        `Bạn đã bị ${botName} vượt giá! Hoàn lại ${oldPrice.toLocaleString()}đ`,
        "info",
      );
    }

    this.save();
    this.notify();
  }

  finalizeAuction(productId: string) {
    const productIndex = this.state.products.findIndex(
      (p) => p.id === productId,
    );
    if (productIndex === -1) return;

    const product = this.state.products[productIndex];
    if (product.status !== "active") return;

    const newProducts = [...this.state.products];
    const deadline = Date.now() + 30 * 60 * 1000;
    newProducts[productIndex] = {
      ...product,
      status: "ended",
      paymentDeadline: product.isLive ? deadline : undefined,
      paymentStatus: product.isLive ? "pending" : undefined,
    };

    let newState = { ...this.state, products: newProducts };

    if (product.highestBidderId === this.state.currentUser?.id) {
      if (product.isLive) {
        // Create pending payment transaction
        const pendingTx: Transaction = {
          id: "t_pen_" + Math.random().toString(36).substr(2, 9),
          productId: product.id,
          buyerId: this.state.currentUser.id,
          sellerId: product.sellerId,
          amount: product.currentPrice,
          status: "pending_payment",
          timestamp: Date.now(),
          title: `Chờ thanh toán (Thắng đấu giá) – ${product.name}`,
          icon: "⏳",
        };
        newState.transactions = [pendingTx, ...this.state.transactions];

        this.addNotification(
          `Bạn đã thắng! Bạn có 30 phút để thanh toán cho ${product.name}.`,
          "success",
        );
      } else {
        this.addNotification(
          `Chúc mừng! Bạn đã thắng phiên đấu giá ${product.name}! Vui lòng điền thông tin nhận hàng trong Profile.`,
          "success",
        );
      }
    }

    this.state = newState;
    this.save();
  }

  payAuction(productId: string) {
    const productIndex = this.state.products.findIndex(
      (p) => p.id === productId,
    );
    if (productIndex === -1 || !this.state.currentUser) return;

    const product = this.state.products[productIndex];
    if (this.state.currentUser.balance < product.currentPrice) {
      this.addNotification("Số dư không đủ để thanh toán!", "warning");
      return;
    }

    const user = { ...this.state.currentUser };
    user.balance -= product.currentPrice;
    user.frozenBalance += product.currentPrice;

    const newProducts = [...this.state.products];
    newProducts[productIndex] = {
      ...product,
      paymentStatus: "paid",
      status: "disbursed",
    };

    const txIndex = this.state.transactions.findIndex(
      (t) => t.productId === productId && t.status === "pending_payment",
    );

    let newTransactions = [...this.state.transactions];
    if (txIndex !== -1) {
      newTransactions[txIndex] = {
        ...newTransactions[txIndex],
        status: "frozen",
        title: `Thanh toán: Chờ giao hàng – ${product.name}`,
        icon: "🔒",
      };
    } else {
      const tx: Transaction = {
        id: "t_pay_" + Math.random().toString(36).substr(2, 9),
        productId: product.id,
        buyerId: user.id,
        sellerId: product.sellerId,
        amount: product.currentPrice,
        status: "frozen",
        timestamp: Date.now(),
        title: `Thanh toán: Chờ giao hàng – ${product.name}`,
        icon: "🔒",
      };
      newTransactions = [tx, ...newTransactions];
    }

    this.state = {
      ...this.state,
      currentUser: user,
      products: newProducts,
      transactions: newTransactions,
    };
    this.addNotification("Thanh toán thành công!", "success");
    this.save();
  }

  updateTransactionShippingInfo(transactionId: string, info: any) {
    const txIndex = this.state.transactions.findIndex(
      (t) => t.id === transactionId,
    );
    if (txIndex === -1) return;

    const newTransactions = [...this.state.transactions];
    newTransactions[txIndex] = {
      ...newTransactions[txIndex],
      shippingInfo: info,
      title: newTransactions[txIndex].title?.replace(
        "Chờ giao hàng",
        "Đang vận chuyển",
      ),
    };

    this.state = {
      ...this.state,
      transactions: newTransactions,
    };
    this.addNotification("Đã cập nhật thông tin giao hàng!", "success");
    this.save();
    this.notify();
  }

  applyPenalty(productId: string) {
    const productIndex = this.state.products.findIndex(
      (p) => p.id === productId,
    );
    if (productIndex === -1 || !this.state.currentUser) return;

    const product = this.state.products[productIndex];
    if (product.paymentStatus !== "pending") return;

    // 10% Penalty
    const penaltyAmount = Math.floor(product.currentPrice * 0.1);
    const user = { ...this.state.currentUser };
    user.balance = Math.max(0, user.balance - penaltyAmount);

    const newProducts = [...this.state.products];
    newProducts[productIndex] = { ...product, paymentStatus: "penalized" };

    this.state = {
      ...this.state,
      currentUser: user,
      products: newProducts,
    };
    this.addNotification(
      `Bạn bị phạt ${penaltyAmount.toLocaleString()}đ vì không thanh toán đúng hạn!`,
      "warning",
    );
    this.save();
    this.notify();
  }

  clearTransactions() {
    this.state = {
      ...this.state,
      transactions: [],
    };
    this.addNotification("Đã xóa lịch sử giao dịch.", "info");
    this.save();
    this.notify();
  }

  resetProduct(productId: string) {
    const productIndex = this.state.products.findIndex(
      (p) => p.id === productId,
    );
    if (productIndex === -1) return;

    const product = this.state.products[productIndex];
    const newProducts = [...this.state.products];
    newProducts[productIndex] = {
      ...product,
      currentPrice: product.startPrice,
      highestBidderId: null,
      status: "active",
      paymentDeadline: undefined,
      paymentStatus: undefined,
    };

    this.state = {
      ...this.state,
      products: newProducts,
    };
    this.addNotification(
      `Đã reset sản phẩm ${product.name} về giá khởi điểm.`,
      "info",
    );
    this.save();
    this.notify();
  }

  confirmReceipt(transactionId: string) {
    const txIndex = this.state.transactions.findIndex(
      (t) => t.id === transactionId,
    );
    if (txIndex === -1) return;

    const tx = this.state.transactions[txIndex];
    if (tx.status !== "frozen") return;

    const newTransactions = [...this.state.transactions];
    newTransactions[txIndex] = {
      ...tx,
      status: "disbursed",
      title: (tx.title || "Giao dịch TillBid").replace("Đặt cọc", "Hoàn tất"),
    };

    let newState = { ...this.state, transactions: newTransactions };

    const currentUser = this.state.currentUser;
    if (currentUser?.id === tx.buyerId) {
      const user = { ...currentUser };
      user.frozenBalance = Math.max(0, user.frozenBalance - tx.amount);
      newState = { ...newState, currentUser: user };
      this.addNotification(
        `Đã xác nhận nhận hàng! Số tiền ${tx.amount.toLocaleString()}đ đã được chuyển cho người bán.`,
        "success",
      );
    }

    this.state = newState;
    this.save();
  }

  postProduct(data: {
    name: string;
    description: string;
    category: string;
    startPrice: number;
    durationHours: number;
  }) {
    if (!this.state.currentUser) return;

    const newProduct: Product = {
      id: "p" + Math.random().toString(36).substr(2, 9),
      name: data.name,
      description: data.description,
      category: data.category,
      sellerId: this.state.currentUser.id,
      image: `https://placehold.co/600x400/1e293b/white?text=${encodeURIComponent(data.name)}`,
      images: [],
      startPrice: data.startPrice,
      currentPrice: data.startPrice,
      highestBidderId: null,
      endTime: Date.now() + 1000 * 60 * 60 * data.durationHours,
      status: "active",
      watchlistCount: 0,
      condition: "Brand New",
    };

    this.state = {
      ...this.state,
      products: [newProduct, ...this.state.products],
    };

    this.addNotification("Product posted successfully!", "success");
    this.save();
    return newProduct.id;
  }

  deposit(amount: number) {
    if (!this.state.currentUser) return;
    const user = { ...this.state.currentUser };
    user.balance += amount;
    this.state = { ...this.state, currentUser: user };
    this.addNotification(
      `Đã nạp thành công ${amount.toLocaleString()}đ vào ví!`,
      "success",
    );
    this.save();
  }

  withdraw(amount: number) {
    if (!this.state.currentUser) return;
    if (this.state.currentUser.balance < amount) {
      this.addNotification("Số dư không đủ để rút tiền!", "warning");
      return;
    }
    const user = { ...this.state.currentUser };
    user.balance -= amount;
    this.state = { ...this.state, currentUser: user };
    this.addNotification(
      `Đã rút thành công ${amount.toLocaleString()}đ về ngân hàng!`,
      "success",
    );
    this.save();
  }

  addNotification(
    message: string,
    type: "info" | "success" | "warning" = "info",
  ) {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotifications = [
      { id, message, type, timestamp: Date.now() },
      ...this.state.notifications,
    ];

    this.state = { ...this.state, notifications: newNotifications };
    this.save();

    setTimeout(() => {
      this.removeNotification(id);
    }, 5000);
  }

  removeNotification(id: string) {
    this.state = {
      ...this.state,
      notifications: this.state.notifications.filter((n) => n.id !== id),
    };
    this.save();
  }

  simulateLiveActivity() {
    const products = this.state.products.filter((p) => p.status === "active");
    if (products.length === 0) return;

    const product = products[Math.floor(Math.random() * products.length)];
    const randomAction = Math.random();

    if (randomAction > 0.7) {
      const increment = Math.floor(Math.random() * 5) * 50000 + 50000;
      const oldPrice = product.currentPrice;
      const newPrice = product.currentPrice + increment;
      const mockNames = [
        "Hồng Quân",
        "Thanh Thảo",
        "Minh Nhật",
        "Gia Bảo",
        "Quỳnh Anh",
      ];
      const mockUser = mockNames[Math.floor(Math.random() * mockNames.length)];

      const productIndex = this.state.products.findIndex(
        (p) => p.id === product.id,
      );
      const prevBidderId = product.highestBidderId;

      const newProducts = [...this.state.products];
      newProducts[productIndex] = {
        ...product,
        currentPrice: newPrice,
        highestBidderId: "mock_" + mockUser,
      };

      // Check if current user was just outbid
      if (!product.isLive && prevBidderId === this.state.currentUser?.id) {
        const user = { ...this.state.currentUser };
        user.balance += oldPrice;
        user.frozenBalance -= oldPrice;

        const refundTx = {
          id: "t_ref_sim_" + Math.random().toString(36).substr(2, 9),
          productId: product.id,
          buyerId: user.id,
          sellerId: product.sellerId,
          amount: oldPrice,
          status: "disbursed" as const,
          timestamp: Date.now(),
          title: `Hoàn tiền: Bị vượt giá – ${product.name}`,
          icon: "💰",
        };

        this.state = {
          ...this.state,
          products: newProducts,
          currentUser: user,
          transactions: [...this.state.transactions, refundTx],
        };

        this.addNotification(
          `Bạn vừa bị vượt mặt bởi người dùng ${mockUser}! Tiền cọc ${oldPrice.toLocaleString()}đ đã hoàn về ví.`,
          "warning",
        );
      } else {
        this.state = { ...this.state, products: newProducts };
        this.addNotification(
          `${mockUser} vừa đặt thầu cho ${product.name}!`,
          "info",
        );
      }

      this.save();
    } else if (randomAction > 0.4) {
      const productIndex = this.state.products.findIndex(
        (p) => p.id === product.id,
      );
      const newProducts = [...this.state.products];
      newProducts[productIndex] = {
        ...product,
        watchlistCount: product.watchlistCount + 1,
      };
      this.state = { ...this.state, products: newProducts };
      this.save();
    }
  }

  startSimulation() {
    setInterval(
      () => this.simulateLiveActivity(),
      15000 + Math.random() * 10000,
    );
  }

  addSellerReview(sellerId: string, rating: number, comment: string) {
    if (!this.state.currentUser) {
      this.addNotification("Vui lòng đăng nhập để đánh giá!", "warning");
      return;
    }

    const review: SellerReview = {
      id: "r" + Math.random().toString(36).substr(2, 9),
      sellerId,
      buyerId: this.state.currentUser.id,
      buyerName: this.state.currentUser.name,
      rating: Math.max(1, Math.min(5, rating)),
      comment,
      timestamp: Date.now(),
    };

    this.state = {
      ...this.state,
      sellerReviews: [...this.state.sellerReviews, review],
    };
    this.addNotification("Đánh giá của bạn đã được lưu!", "success");
    this.save();
  }

  getSellerReviews(sellerId: string): SellerReview[] {
    return this.state.sellerReviews.filter((r) => r.sellerId === sellerId);
  }

  getSellerAverageRating(sellerId: string): number {
    const reviews = this.getSellerReviews(sellerId);
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }
}

export const store = new Store();
store.startSimulation();
