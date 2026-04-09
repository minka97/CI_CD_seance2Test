/** @format */

import express from "express";
import { ordersRouter } from "./routes/orders.js";
import { promoRouter } from "./routes/promo.js";

export const app = express();

app.use(express.json());
app.use("/orders", ordersRouter);
app.use("/promo", promoRouter);
