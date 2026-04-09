/** @format */

import request from "supertest";
import { app } from "../app.js";
import { resetOrders, getOrderCount } from "../store/ordersStore.js";

beforeEach(() => {
  resetOrders();
});

// Base order body reused across tests
// subtotal = 12.5 * 2 = 25
// delivery = 2 + (5-3)*0.5 = 3.0 ; surge tuesday 15h = 1.0
// total = 25 + 3 = 28
const baseOrder = {
  items: [{ name: "Pizza", price: 12.5, quantity: 2 }],
  distance: 5,
  weight: 2,
  hour: 15,
  day: "tuesday",
};

// ─────────────────────────────────────────────
// POST /orders/simulate
// ─────────────────────────────────────────────

describe("POST /orders/simulate", () => {
  test("should return 200 with correct price details for a normal order", async () => {
    const res = await request(app).post("/orders/simulate").send(baseOrder);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      subtotal: 25,
      discount: 0,
      deliveryFee: 3,
      surge: 1.0,
      total: 28,
    });
  });

  test("should apply discount when using a valid promo code", async () => {
    // BIENVENUE20 = 20% off, minOrder 15
    // afterPromo = 25 - 5 = 20 ; total = 20 + 3 = 23
    const res = await request(app)
      .post("/orders/simulate")
      .send({ ...baseOrder, promoCode: "BIENVENUE20" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      subtotal: 25,
      discount: 5,
      total: 23,
    });
  });

  test("should return 400 when promo code is expired", async () => {
    const res = await request(app)
      .post("/orders/simulate")
      .send({ ...baseOrder, promoCode: "EXPIRE" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("should return 400 when cart is empty", async () => {
    const res = await request(app)
      .post("/orders/simulate")
      .send({ ...baseOrder, items: [] });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("should return 400 when distance exceeds 10km (out of zone)", async () => {
    const res = await request(app)
      .post("/orders/simulate")
      .send({ ...baseOrder, distance: 15 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("should return 400 when hour is outside service hours (23h)", async () => {
    const res = await request(app)
      .post("/orders/simulate")
      .send({ ...baseOrder, hour: 23 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("should multiply deliveryFee by surge on friday evening", async () => {
    // surge friday 20h = 1.8 ; delivery = 3.0 ; deliveryFee = 3.0 * 1.8 = 5.4
    const res = await request(app)
      .post("/orders/simulate")
      .send({ ...baseOrder, hour: 20, day: "friday" });

    expect(res.status).toBe(200);
    expect(res.body.surge).toBe(1.8);
    expect(res.body.deliveryFee).toBe(5.4);
    expect(res.body.total).toBe(30.4);
  });
});

// ─────────────────────────────────────────────
// POST /orders
// ─────────────────────────────────────────────

describe("POST /orders", () => {
  test("should return 201 with stored order containing an ID", async () => {
    const res = await request(app).post("/orders").send(baseOrder);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(typeof res.body.id).toBe("string");
    expect(res.body.total).toBe(28);
  });

  test("should make order retrievable via GET /orders/:id", async () => {
    const postRes = await request(app).post("/orders").send(baseOrder);
    const { id } = postRes.body as { id: string };

    const getRes = await request(app).get(`/orders/${id}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(id);
    expect(getRes.body.total).toBe(28);
  });

  test("should assign different IDs to two distinct orders", async () => {
    const res1 = await request(app).post("/orders").send(baseOrder);
    const res2 = await request(app).post("/orders").send(baseOrder);

    expect(res1.body.id).not.toBe(res2.body.id);
  });

  test("should return 400 and not store the order when order is invalid", async () => {
    const res = await request(app)
      .post("/orders")
      .send({ ...baseOrder, items: [] });

    expect(res.status).toBe(400);
    expect(getOrderCount()).toBe(0);
  });

  test("should not increment the store count when order is invalid", async () => {
    await request(app)
      .post("/orders")
      .send({ ...baseOrder, distance: 15 });

    expect(getOrderCount()).toBe(0);
  });
});

// ─────────────────────────────────────────────
// GET /orders/:id
// ─────────────────────────────────────────────

describe("GET /orders/:id", () => {
  test("should return 200 with complete order for an existing ID", async () => {
    const postRes = await request(app).post("/orders").send(baseOrder);
    const { id } = postRes.body as { id: string };

    const res = await request(app).get(`/orders/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
  });

  test("should return 404 for a non-existing ID", async () => {
    const res = await request(app).get("/orders/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  test("should return a result with all required fields", async () => {
    const postRes = await request(app).post("/orders").send(baseOrder);
    const { id } = postRes.body as { id: string };

    const res = await request(app).get(`/orders/${id}`);

    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("subtotal");
    expect(res.body).toHaveProperty("discount");
    expect(res.body).toHaveProperty("deliveryFee");
    expect(res.body).toHaveProperty("surge");
    expect(res.body).toHaveProperty("total");
  });
});

// ─────────────────────────────────────────────
// POST /promo/validate
// ─────────────────────────────────────────────

describe("POST /promo/validate", () => {
  test("should return 200 with discount details for a valid code", async () => {
    // BIENVENUE20 = 20% off ; 50 - 10 = 40
    const res = await request(app)
      .post("/promo/validate")
      .send({ code: "BIENVENUE20", amount: 50 });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      valid: true,
      code: "BIENVENUE20",
      originalPrice: 50,
      discountedPrice: 40,
      discount: 10,
    });
  });

  test("should return 400 with reason when promo code is expired", async () => {
    const res = await request(app)
      .post("/promo/validate")
      .send({ code: "EXPIRE", amount: 20 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("should return 400 with reason when amount is below minOrder", async () => {
    // REDUC5 minOrder = 10 ; amount = 5 → below minimum
    const res = await request(app)
      .post("/promo/validate")
      .send({ code: "REDUC5", amount: 5 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("should return 404 for an unknown promo code", async () => {
    const res = await request(app)
      .post("/promo/validate")
      .send({ code: "UNKNOWN", amount: 50 });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  test("should return 400 when no code is provided in the body", async () => {
    const res = await request(app)
      .post("/promo/validate")
      .send({ amount: 50 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
