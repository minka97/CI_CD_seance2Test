/** @format */

import { Router } from "express";
import type { Request, Response } from "express";
import { calculateOrderTotal } from "../partieB/utilsTrafication.js";
import { availablePromoCodes } from "../data/promoCodes.js";
import { addOrder, getOrder } from "../store/ordersStore.js";
import type { PromoCode, Item, Day, OrderResult } from "../types/types.js";

export const ordersRouter = Router();

function buildOrderResult(body: Record<string, unknown>): OrderResult {
  const promoCodeStr = body["promoCode"] as string | null | undefined;

  let promoCodeObj: PromoCode | null = null;
  if (promoCodeStr) {
    const found = availablePromoCodes.find((p) => p.code === promoCodeStr);
    if (!found) throw new Error("Invalid promo code");
    promoCodeObj = found;
  }

  return calculateOrderTotal(
    body["items"] as Item[],
    body["distance"] as number,
    body["weight"] as number,
    promoCodeObj as PromoCode,
    availablePromoCodes,
    body["hour"] as number,
    body["day"] as Day,
  );
}

ordersRouter.post("/simulate", (req: Request, res: Response) => {
  try {
    const result = buildOrderResult(req.body as Record<string, unknown>);
    res.status(200).json(result);
  } catch (err) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

ordersRouter.post("/", (req: Request, res: Response) => {
  try {
    const result = buildOrderResult(req.body as Record<string, unknown>);
    const stored = addOrder(result);
    res.status(201).json(stored);
  } catch (err) {
    res
      .status(400)
      .json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

ordersRouter.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  const order = getOrder(req.params.id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.status(200).json(order);
});
