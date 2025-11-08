import { Router } from "express";
import CartManager from "../managers/cartManager.js";

const router = Router();
const manager = new CartManager("./src/data/carts.json");

router.post("/", async (req, res) => {
  try {
    const cart = await manager.createCart();
    res.status(201).json({ status: "success", data: cart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
    res.json({ status: "success", data: cart });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const qty = Number(req.body.quantity) || 1;
  try {
    const cart = await manager.addProductToCart(cid, pid, qty);
    res.status(201).json({ status: "success", data: cart });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
});

export default router;
