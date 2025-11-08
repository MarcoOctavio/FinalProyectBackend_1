// src/app.js
import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";

const app = express();
app.use(express.json());

app.get("/", (_, res) => res.json({ status: "ok", message: "API activa" }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

export default app;
