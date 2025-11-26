import { Router } from "express";
import ProductManagerMongo from "../dao/ProductManagerMongo.js";

const router = Router();
const productManager = new ProductManagerMongo();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const result = await productManager.getProducts({ limit, page, sort, query });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    const buildLink = (targetPage) => {
      const params = new URLSearchParams({
        ...(limit && { limit }),
        ...(sort && { sort }),
        ...(query && { query }),
        page: targetPage
      });
      return `${baseUrl}?${params.toString()}`;
    };

    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Error al obtener productos" });
  }
});

router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.getProductById(pid);
    if (!product) return res.status(404).send("Producto no encontrado");

    res.render("productDetails", {
      product
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar producto");
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
