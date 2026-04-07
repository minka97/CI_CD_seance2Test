/** @format */
import type {
  DeliveryFee,
  PromoCode,
  Day,
  OrderResult,
  Item,
} from "../types/types.js";
function calculateDeliveryFee(distance: number, weight: number): DeliveryFee {
  // 🔴 Cas d'erreur
  if (distance < 0) {
    throw new Error("Distance cannot be negative");
  }

  if (weight < 0) {
    throw new Error("Weight cannot be negative");
  }

  // 🔴 Hors zone
  if (distance > 10) {
    return null;
  }

  // 🟢 Base
  let fee = 2.0;

  // 🟢 Supplément distance
  if (distance > 3) {
    const extraKm = distance - 3;
    fee += extraKm * 0.5;
  }

  // 🟢 Supplément poids
  if (weight > 5) {
    fee += 1.5;
  }

  // 🧮 Arrondi propre à 2 décimales
  return Number(fee.toFixed(2));
}

function applyPromoCode(
  subtotal: number,
  promoCode: PromoCode,
  promoCodes: PromoCode[],
): number {
  // 🔴 erreur input
  if (subtotal < 0) {
    throw new Error("Subtotal cannot be negative");
  }

  // 🟡 pas de code → pas de reduction
  if (!promoCode) {
    return subtotal;
  }

  // 🔴 code inconnu
  const promo = promoCodes.find((p) => p.code === promoCode.code);
  if (!promo) {
    throw new Error("Invalid promo code");
  }

  // 🔴 expiration
  const today = new Date();
  const expiration = new Date(promo.expiresAt);

  if (expiration < today) {
    throw new Error("Promo code expired");
  }

  // 🔴 minimum de commande
  if (subtotal < promo.minOrder) {
    throw new Error("Minimum order not reached");
  }

  let total = subtotal;

  // 🟢 appliquer reduction
  if (promo.type === "percentage") {
    total = subtotal - (subtotal * promo.value) / 100;
  } else if (promo.type === "fixed") {
    total = subtotal - promo.value;
  }

  // 🟡 pas de negatif
  if (total < 0) {
    total = 0;
  }

  return Number(total.toFixed(2));
}

function calculateSurge(hour: number, dayOfWeek: Day): number {
  // 🔴 hors horaires
  if (hour < 10 || hour > 22) {
    return 0;
  }

  // 🟢 dimanche
  if (dayOfWeek === "sunday") {
    return 1.2;
  }

  const isWeekday =
    dayOfWeek === "monday" ||
    dayOfWeek === "tuesday" ||
    dayOfWeek === "wednesday" ||
    dayOfWeek === "thursday";

  // 🟢 lundi-jeudi
  if (isWeekday) {
    if (hour >= 12 && hour <= 13.5) return 1.3; // déjeuner
    if (hour >= 19 && hour <= 21) return 1.5; // dîner
    return 1.0; // normal
  }

  // 🟢 vendredi-samedi soir
  if (
    (dayOfWeek === "friday" || dayOfWeek === "saturday") &&
    hour >= 19 &&
    hour <= 22
  ) {
    return 1.8;
  }

  // 🟢 autres cas ouverts
  return 1.0;
}

function calculateOrderTotal(
  items: Item[],
  distance: number,
  weight: number,
  promoCode: PromoCode,
  promoCodes: PromoCode[],
  hour: number,
  dayOfWeek: Day,
): OrderResult {
  // 🔴 validations
  if (!items || items.length === 0) {
    throw new Error("Empty cart");
  }

  if (hour < 10 || hour > 22) {
    throw new Error("Service closed");
  }

  // 🔴 validation items
  for (const item of items) {
    if (item.price < 0) {
      throw new Error("Invalid price");
    }
  }

  // 🟢 subtotal
  const subtotal = Number(
    items
      .filter((item) => item.quantity > 0)
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2),
  );

  // 🟢 promo
  const afterPromo = applyPromoCode(subtotal, promoCode, promoCodes);
  const discount = Number((subtotal - afterPromo).toFixed(2));

  // 🟢 livraison
  const delivery = calculateDeliveryFee(distance, weight);

  if (delivery === null) {
    throw new Error("Out of delivery zone");
  }

  // 🟢 surge
  const surge = calculateSurge(hour, dayOfWeek);

  if (surge === 0) {
    throw new Error("Service closed");
  }

  const deliveryWithSurge = Number((delivery * surge).toFixed(2));

  // 🟢 total
  const total = Number((afterPromo + deliveryWithSurge).toFixed(2));

  return {
    subtotal,
    discount,
    deliveryFee: deliveryWithSurge,
    surge,
    total,
  };
}

export {
  calculateOrderTotal,
  calculateDeliveryFee,
  applyPromoCode,
  calculateSurge,
};
