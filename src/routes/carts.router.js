import { Router } from "express";
import CartManagerMongo from "../dao/CartManagerMongo.js";

const router = Router();
const cartManager = new CartManagerMongo();

router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).send("Carrito no encontrado");
  res.json(cart);
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
  if (!cart) return res.status(404).send("Carrito no encontrado");
  res.json(cart);
});

router.put("/:cid", async (req, res) => {
  const { products } = req.body;
  const cart = await cartManager.updateCartProducts(req.params.cid, products);
  res.json(cart);
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { quantity } = req.body;
  const cart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
  res.json(cart);
});

router.delete("/:cid", async (req, res) => {
  const cart = await cartManager.clearCart(req.params.cid);
  res.json(cart);
});

export default router;
