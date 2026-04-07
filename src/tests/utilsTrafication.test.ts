/** @format */

import {
  calculateDeliveryFee,
  applyPromoCode,
} from "../partieB/utilsTrafication.js";
import type { PromoCode } from "../types/types.js";

describe("calculateDeliveryFee", () => {
  // 🟢 Cas normaux
  test("should return 2.00 when distance is 2km and weight is 1kg", () => {
    expect(calculateDeliveryFee(2, 1)).toBe(2.0);
  });

  test("should return 4.00 when distance is 7km and weight is 3kg", () => {
    expect(calculateDeliveryFee(7, 3)).toBe(4.0);
  });

  test("should return 4.50 when distance is 5km and weight is 8kg", () => {
    expect(calculateDeliveryFee(5, 8)).toBe(4.5);
  });

  // 🟡 Cas limites
  test("should return 2.00 when distance is exactly 3km", () => {
    expect(calculateDeliveryFee(3, 2)).toBe(2.0);
  });

  test("should return 5.50 when distance is exactly 10km and weight is 5kg", () => {
    expect(calculateDeliveryFee(10, 5)).toBe(5.5);
  });

  test("should return 3.00 when weight is exactly 5kg and distance is 5km", () => {
    expect(calculateDeliveryFee(5, 5)).toBe(3.0);
  });

  test("should return 2.00 when distance is 0km and weight is 1kg", () => {
    expect(calculateDeliveryFee(0, 1)).toBe(2.0);
  });

  // 🔴 Cas d'erreur
  test("should return null when distance is greater than 10km", () => {
    expect(calculateDeliveryFee(15, 2)).toBeNull();
  });

  test("should throw when distance is negative", () => {
    expect(() => calculateDeliveryFee(-1, 2)).toThrow();
  });

  test("should throw when weight is negative", () => {
    expect(() => calculateDeliveryFee(2, -1)).toThrow();
  });

  // 🧮 Calculs précis
  test("should return 3.50 when distance is 6km and weight is 2kg", () => {
    expect(calculateDeliveryFee(6, 2)).toBe(3.5);
  });

  test("should return 7.00 when distance is 10km and weight is 6kg", () => {
    expect(calculateDeliveryFee(10, 6)).toBe(7.0);
  });
});

const bienvenue20: PromoCode = {
  code: "BIENVENUE20",
  type: "percentage",
  value: 20,
  minOrder: 15,
  expiresAt: "2099-12-31",
};

const reduc5: PromoCode = {
  code: "REDUC5",
  type: "fixed",
  value: 5,
  minOrder: 10,
  expiresAt: "2099-12-31",
};

const expire: PromoCode = {
  code: "EXPIRE",
  type: "fixed",
  value: 5,
  minOrder: 10,
  expiresAt: "2020-01-01",
};

const unknown: PromoCode = {
  code: "UNKNOWN",
  type: "fixed",
  value: 5,
  minOrder: 0,
  expiresAt: "2099-12-31",
};

const promoCodes: PromoCode[] = [bienvenue20, reduc5, expire];

describe("applyPromoCode", () => {
  // 🟢 cas normaux
  test("should return 40 when applying 20% promo on 50€ order", () => {
    expect(applyPromoCode(50, bienvenue20, promoCodes)).toBe(40);
  });

  test("should return 25 when applying fixed 5€ promo on 30€ order", () => {
    expect(applyPromoCode(30, reduc5, promoCodes)).toBe(25);
  });

  test("should return 15 when applying fixed 5€ promo on 20€ order above minOrder", () => {
    expect(applyPromoCode(20, reduc5, promoCodes)).toBe(15);
  });

  // 🔴 refus
  test("should throw when promo code is expired", () => {
    expect(() => applyPromoCode(20, expire, promoCodes)).toThrow();
  });

  test("should throw when subtotal is below minOrder", () => {
    expect(() => applyPromoCode(5, reduc5, promoCodes)).toThrow();
  });

  test("should throw when promo code is unknown", () => {
    expect(() => applyPromoCode(20, unknown, promoCodes)).toThrow();
  });

  // 🟡 cas limites
  test("should return 0 when fixed discount exceeds subtotal", () => {
    expect(applyPromoCode(3, bienvenue20, [{ ...bienvenue20, minOrder: 0, type: "fixed", value: 10 }])).toBe(0);
  });

  test("should return 0 when percentage promo is 100%", () => {
    const free: PromoCode = {
      code: "FREE",
      type: "percentage",
      value: 100,
      minOrder: 0,
      expiresAt: "2099-12-31",
    };
    expect(applyPromoCode(50, free, [free])).toBe(0);
  });

  test("should return 0 when subtotal is 0 and no promo code", () => {
    expect(applyPromoCode(0, null as unknown as PromoCode, promoCodes)).toBe(0);
  });

  // 🚫 inputs invalides
  test("should return subtotal without reduction when promo code is null", () => {
    expect(applyPromoCode(20, null as unknown as PromoCode, promoCodes)).toBe(20);
  });

  test("should throw when subtotal is negative", () => {
    expect(() => applyPromoCode(-10, reduc5, promoCodes)).toThrow();
  });
});
