/** @format */

import type { PromoCode } from "../types/types.js";

export const availablePromoCodes: PromoCode[] = [
  {
    code: "BIENVENUE20",
    type: "percentage",
    value: 20,
    minOrder: 15,
    expiresAt: "2099-12-31",
  },
  {
    code: "REDUC5",
    type: "fixed",
    value: 5,
    minOrder: 10,
    expiresAt: "2099-12-31",
  },
  {
    code: "EXPIRE",
    type: "fixed",
    value: 5,
    minOrder: 10,
    expiresAt: "2020-01-01",
  },
];
