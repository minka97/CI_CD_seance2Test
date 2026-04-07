/** @format */
import type { DeliveryFee } from "../types/types.js";
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

export { calculateDeliveryFee };
