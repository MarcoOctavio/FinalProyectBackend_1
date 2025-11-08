import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

import app from "./app.js";
import ProductManager from "./managers/productManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productManager = new ProductManager("./src/data/products.json");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("🟢 Nuevo cliente conectado");

  const products = await productManager.getProducts();
  socket.emit("products", products);

  socket.on("createProduct", async (data, cb) => {
    try {
      await productManager.addProduct(data);
      const updated = await productManager.getProducts();
      io.emit("products", updated);
      cb({ ok: true });
    } catch (err) {
      cb({ ok: false, error: err.message });
    }
  });

  socket.on("deleteProduct", async (id, cb) => {
    try {
      await productManager.deleteProduct(id);
      const updated = await productManager.getProducts();
      io.emit("products", updated);
      cb({ ok: true });
    } catch (err) {
      cb({ ok: false, error: err.message });
    }
  });

  socket.on("disconnect", () => console.log("🔴 Cliente desconectado"));
});

const PORT = 8080;
httpServer.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
