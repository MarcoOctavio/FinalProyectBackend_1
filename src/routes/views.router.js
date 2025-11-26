import { Router } from "express";
import ProductManagerMongo from "../dao/ProductManagerMongo.js";
import CartManagerMongo from "../dao/CartManagerMongo.js";

const router = Router();
const productManager = new ProductManagerMongo();
const cartManager = new CartManagerMongo();


router.get("/", async (req, res) => {
  try {
    const result = await productManager.getProducts({ limit: 100 });
    res.render("home", { products: result.docs });
  } catch (error) {
    console.log("Error cargando productos en HOME:", error);
    res.status(500).send("Error cargando la vista de inicio");
  }
});

router.get("/products", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const result = await productManager.getProducts({ limit, page, sort, query });
  res.render("products", result);
});

router.get("/products/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  res.render("productDetails", { product });
});

router.get("/carts/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  res.render("cart", { cart });
});

export default router;
