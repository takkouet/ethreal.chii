export type PaymentMethod = "COD" | "BANK_QR" | "CARD_CONTACT";
export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";

export type CartItem = {
  productId: string;
  name: string;
  priceVnd: number;
  imageUrl: string;
  stock: number;
  quantity: number;
};
