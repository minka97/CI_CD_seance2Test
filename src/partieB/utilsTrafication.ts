/** @format */
import type { DeliveryFee, PromoCode } from "../types/types.js";
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

export { calculateDeliveryFee, applyPromoCode };
