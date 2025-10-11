import express from "express";
import ProductManager from "./productManager.js";
import CartManager from "./cartManager.js";

const app = express();
app.use( express.json() );
const productManager = new ProductManager("./src/products.json");
const cartManager = new CartManager("./src/carts.json");

//endpoints
app.get("/", (req, res)=> {
  res.json( { status: "success", message: "Hola Mundo!" } )
})

app.get("/api/products", async(req, res)=> {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({ message: "Lista de productos", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/api/products/:pid", async(req, res)=> {
  try {
    const pid = req.params.pid;
    const products = await productManager.deleteProductById(pid);
    res.status(200).json({ message: "Producto Eliminado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/products", async(req, res)=> {
  try {
    const newProduct = req.body;
    const products = await productManager.addProduct(newProduct);
    res.status(201).json({ message: "Producto agregado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/products/:pid", async(req, res)=> {
  try {
    const pid = req.params.pid;
    const updates = req.body;

    const products = await productManager.setProductById(pid, updates);
    res.status(200).json({ message: "Producto Actualizado", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/carts", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({
      status: "success",
      message: "Carrito creado",
      cart: newCart
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

/**
 * GET /api/carts/:cid
 * Lista los productos del carrito (array de { product, quantity })
 */
app.get("/api/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const products = await cartManager.getCartById(cid);
    res.status(200).json({
      status: "success",
      cartId: cid,
      products
    });
  } catch (error) {
    const code = /no encontrado/i.test(error.message) ? 404 : 500;
    res.status(code).json({ status: "error", message: error.message });
  }
});

/**
 * POST /api/carts/:cid/product/:pid
 * Agrega/incrementa un producto (quantity opcional, default 1)
 * body: { "quantity": 3 }
 */
app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const qty = Number.isFinite(req.body?.quantity) ? Number(req.body.quantity) : 1;

  try {
    const updatedCart = await cartManager.addProduct(cid, pid, qty);
    res.status(201).json({
      status: "success",
      message: `Producto ${pid} agregado al carrito ${cid}`,
      cart: updatedCart
    });
  } catch (error) {
    let code = 500;
    if (/Carrito no encontrado/i.test(error.message)) code = 404;
    if (/Producto no existe|cantidad/i.test(error.message)) code = 400;
    res.status(code).json({ status: "error", message: error.message });
  }
});


app.listen(8080, ()=> {
  console.log("Servidor iniciado correctamente en el puerto 8080!");
});