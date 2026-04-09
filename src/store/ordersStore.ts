/** @format */

import { randomUUID } from "crypto";
import type { OrderResult } from "../types/types.js";

export type StoredOrder = OrderResult & { id: string };

const orders = new Map<string, StoredOrder>();

export function addOrder(result: OrderResult): StoredOrder {
  const id = randomUUID();
  const stored: StoredOrder = { id, ...result };
  orders.set(id, stored);
  return stored;
}

export function getOrder(id: string): StoredOrder | undefined {
  return orders.get(id);
}

export function getOrderCount(): number {
  return orders.size;
}

export function resetOrders(): void {
  orders.clear();
}
