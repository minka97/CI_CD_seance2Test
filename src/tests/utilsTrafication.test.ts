/** @format */

import {
  calculateDeliveryFee,
  applyPromoCode,
  calculateSurge,
  calculateOrderTotal,
} from "../partieB/utilsTrafication.js";
import type { PromoCode, Item, Day } from "../types/types.js";

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
    const bigDiscount: PromoCode = {
      ...bienvenue20,
      type: "fixed",
      value: 10,
      minOrder: 0,
    };
    expect(applyPromoCode(3, bigDiscount, [bigDiscount])).toBe(0);
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

describe("calculateSurge", () => {
  // 🟢 cas normaux
  test("should return 1.0 when day is tuesday and hour is 15h", () => {
    expect(calculateSurge(15, "tuesday" as Day)).toBe(1.0);
  });

  test("should return 1.3 when day is wednesday and hour is 12h30 (lunch)", () => {
    expect(calculateSurge(12.5, "wednesday" as Day)).toBe(1.3);
  });

  test("should return 1.5 when day is thursday and hour is 20h (dinner)", () => {
    expect(calculateSurge(20, "thursday" as Day)).toBe(1.5);
  });

  test("should return 1.8 when day is friday and hour is 21h (weekend evening)", () => {
    expect(calculateSurge(21, "friday" as Day)).toBe(1.8);
  });

  test("should return 1.2 when day is sunday and hour is 14h", () => {
    expect(calculateSurge(14, "sunday" as Day)).toBe(1.2);
  });

  // 🟡 limites
  test("should return 1.0 when hour is 11h30 (before lunch)", () => {
    expect(calculateSurge(11.5, "monday" as Day)).toBe(1.0);
  });

  test("should return 1.5 when hour is exactly 19h on wednesday", () => {
    expect(calculateSurge(19, "wednesday" as Day)).toBe(1.5);
  });

  test("should return 1.8 when hour is exactly 22h on friday", () => {
    expect(calculateSurge(22, "friday" as Day)).toBe(1.8);
  });

  test("should return 0 when hour is 9h59 (service closed)", () => {
    expect(calculateSurge(9.99, "tuesday" as Day)).toBe(0);
  });

  test("should return 1.0 when hour is exactly 10h (opening)", () => {
    expect(calculateSurge(10, "tuesday" as Day)).toBe(1.0);
  });
});

const promo20: PromoCode = {
  code: "PROMO20",
  type: "percentage",
  value: 20,
  minOrder: 10,
  expiresAt: "2099-12-31",
};

const orderPromoCodes: PromoCode[] = [promo20];

describe("calculateOrderTotal", () => {
  const items: Item[] = [{ name: "Pizza", price: 12.5, quantity: 2 }];

  // 🟢 scenario complet
  test("should return correct total when no promo on tuesday at 15h", () => {
    const result = calculateOrderTotal(
      items,
      5,
      2,
      null as unknown as PromoCode,
      orderPromoCodes,
      15,
      "tuesday" as Day,
    );

    expect(result.subtotal).toBe(25);
    expect(result.surge).toBe(1.0);
    expect(result.total).toBe(26);
  });

  test("should apply 5€ discount when using 20% promo on 25€ order", () => {
    const result = calculateOrderTotal(
      items,
      5,
      2,
      promo20,
      orderPromoCodes,
      15,
      "tuesday" as Day,
    );

    expect(result.discount).toBe(5);
    expect(result.total).toBe(21);
  });

  test("should return surge 1.8 when ordering on friday evening", () => {
    const result = calculateOrderTotal(
      items,
      5,
      2,
      null as unknown as PromoCode,
      orderPromoCodes,
      20,
      "friday" as Day,
    );

    expect(result.surge).toBe(1.8);
  });

  // 🔴 erreurs
  test("should throw when cart is empty", () => {
    expect(() =>
      calculateOrderTotal(
        [],
        5,
        2,
        null as unknown as PromoCode,
        orderPromoCodes,
        15,
        "tuesday" as Day,
      ),
    ).toThrow();
  });

  test("should throw when item price is negative", () => {
    const badItems: Item[] = [{ name: "Pizza", price: -10, quantity: 1 }];

    expect(() =>
      calculateOrderTotal(
        badItems,
        5,
        2,
        null as unknown as PromoCode,
        orderPromoCodes,
        15,
        "tuesday" as Day,
      ),
    ).toThrow();
  });

  test("should throw when hour is outside service hours", () => {
    expect(() =>
      calculateOrderTotal(
        items,
        5,
        2,
        null as unknown as PromoCode,
        orderPromoCodes,
        23,
        "tuesday" as Day,
      ),
    ).toThrow();
  });

  test("should throw when distance exceeds 10km", () => {
    expect(() =>
      calculateOrderTotal(
        items,
        15,
        2,
        null as unknown as PromoCode,
        orderPromoCodes,
        15,
        "tuesday" as Day,
      ),
    ).toThrow();
  });

  // 🟡 cas limites
  test("should return subtotal of 10 when item with quantity 0 is ignored", () => {
    const items2: Item[] = [
      { name: "Pizza", price: 12.5, quantity: 0 },
      { name: "Burger", price: 10, quantity: 1 },
    ];

    const result = calculateOrderTotal(
      items2,
      5,
      2,
      null as unknown as PromoCode,
      orderPromoCodes,
      15,
      "tuesday" as Day,
    );

    expect(result.subtotal).toBe(10);
  });

  test("should return total equal to subtotal plus deliveryFee when no promo", () => {
    const result = calculateOrderTotal(
      items,
      5,
      2,
      null as unknown as PromoCode,
      orderPromoCodes,
      15,
      "tuesday" as Day,
    );

    expect(result.total).toBe(result.subtotal + result.deliveryFee);
  });

  test("should return total greater than subtotal when surge is applied", () => {
    const result = calculateOrderTotal(
      items,
      5,
      2,
      null as unknown as PromoCode,
      orderPromoCodes,
      20,
      "friday" as Day,
    );

    expect(result.total).toBeGreaterThan(result.subtotal);
  });

  test("should return result with all required properties", () => {
    const result = calculateOrderTotal(
      items,
      5,
      2,
      null as unknown as PromoCode,
      orderPromoCodes,
      15,
      "tuesday" as Day,
    );

    expect(result).toHaveProperty("subtotal");
    expect(result).toHaveProperty("discount");
    expect(result).toHaveProperty("deliveryFee");
    expect(result).toHaveProperty("surge");
    expect(result).toHaveProperty("total");
  });
});
