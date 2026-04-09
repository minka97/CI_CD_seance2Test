/** @format */

import { Router } from "express";
import type { Request, Response } from "express";
import { applyPromoCode } from "../partieB/utilsTrafication.js";
import { availablePromoCodes } from "../data/promoCodes.js";

export const promoRouter = Router();

promoRouter.post("/validate", (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;
  const code = body["code"] as string | undefined;
  const amount = body["amount"] as number | undefined;

  if (!code) {
    res.status(400).json({ error: "Missing promo code" });
    return;
  }

  if (amount === undefined || amount === null) {
    res.status(400).json({ error: "Missing amount" });
    return;
  }

  const promo = availablePromoCodes.find((p) => p.code === code);
  if (!promo) {
    res.status(404).json({ error: "Promo code not found" });
    return;
  }

  try {
    const discountedPrice = applyPromoCode(amount, promo, availablePromoCodes);
    const discount = Number((amount - discountedPrice).toFixed(2));

    res.status(200).json({
      valid: true,
      code: promo.code,
      originalPrice: amount,
      discountedPrice,
      discount,
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});
