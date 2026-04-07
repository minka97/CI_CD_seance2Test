/** @format */

import { calculateDeliveryFee } from "../partieB/utilsTrafication.js";

describe("calculateDeliveryFee", () => {
  // 🟢 Cas normaux
  test("2 km, 1 kg → base uniquement", () => {
    expect(calculateDeliveryFee(2, 1)).toBe(2.0);
  });

  test("7 km, 3 kg → supplement distance", () => {
    expect(calculateDeliveryFee(7, 3)).toBe(4.0);
  });

  test("5 km, 8 kg → supplement distance + poids", () => {
    expect(calculateDeliveryFee(5, 8)).toBe(4.5);
  });

  // 🟡 Cas limites
  test("exactement 3 km → pas de supplement", () => {
    expect(calculateDeliveryFee(3, 2)).toBe(2.0);
  });

  test("exactement 10 km → accepte", () => {
    expect(calculateDeliveryFee(10, 5)).toBe(5.5);
  });

  test("exactement 5 kg → pas de supplement poids", () => {
    expect(calculateDeliveryFee(5, 5)).toBe(3.0);
  });

  test("distance = 0 → valide", () => {
    expect(calculateDeliveryFee(0, 1)).toBe(2.0);
  });

  // 🔴 Cas d'erreur
  test("distance > 10 km → refuse (null)", () => {
    expect(calculateDeliveryFee(15, 2)).toBeNull();
  });

  test("distance negative → erreur", () => {
    expect(() => calculateDeliveryFee(-1, 2)).toThrow();
  });

  test("poids negatif → erreur", () => {
    expect(() => calculateDeliveryFee(2, -1)).toThrow();
  });

  // 🧮 Calculs précis
  test("6 km, 2 kg → 3.50", () => {
    expect(calculateDeliveryFee(6, 2)).toBe(3.5);
  });

  test("10 km, 6 kg → 7.00", () => {
    expect(calculateDeliveryFee(10, 6)).toBe(7.0);
  });
});
