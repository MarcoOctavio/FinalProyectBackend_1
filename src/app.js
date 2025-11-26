import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import { connectDB } from "./config/db.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("./src/public"));

connectDB();

app.use(express.static("./src/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

export default app;
