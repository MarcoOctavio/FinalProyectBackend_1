import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();
const manager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.json({ status: "success", data: products });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = await manager.addProduct(req.body);
    res.status(201).json({ status: "success", data: product });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updated = await manager.updateProduct(req.params.pid, req.body);
    res.json({ status: "success", data: updated });
  } catch (err) {
    res.status(404).json({ status: "error", message: err.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await manager.deleteProduct(req.params.pid);
    if (!deleted) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ status: "success", message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
