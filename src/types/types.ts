/** @format */
export interface Student {
  name: string | null;
  grade: number;
  age: number;
}
export type DeliveryFee = number | null;
export type PromoType = "percentage" | "fixed";

export type PromoCode = {
  code: string;
  type: PromoType;
  value: number;
  minOrder: number;
  expiresAt: string; // format YYYY-MM-DD
};

export type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type Item = {
  name: string;
  price: number;
  quantity: number;
};

export type OrderResult = {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  surge: number;
  total: number;
};
