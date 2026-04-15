export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Format currency for display (e.g., "50.000đ", "1.500.000đ")
export const formatPriceVN = (amount: number): string => {
    return amount.toLocaleString('vi-VN') + 'đ';
};

// Format quick bid increment (e.g., "+50.000đ", "+100.000đ")
export const formatQuickBidLabel = (increment: number): string => {
    return '+' + increment.toLocaleString('vi-VN') + 'đ';
};

export const formatCountdown = (endTime: number) => {
    const now = Date.now();
    const diff = endTime - now;
    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
};
