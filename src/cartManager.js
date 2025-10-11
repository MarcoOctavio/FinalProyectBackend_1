import fs from "fs/promises";
import crypto from "crypto";

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId() {
    return crypto.randomUUID();
  }

  async ensureFile() {
    try {
      await fs.access(this.pathFile);
    } catch {
      await fs.writeFile(this.pathFile, JSON.stringify([], null, 2), "utf-8");
    }
  }

  async readAll() {
    await this.ensureFile();
    const fileData = await fs.readFile(this.pathFile, "utf-8");
    return JSON.parse(fileData || "[]");
  }

  async writeAll(carts) {
    await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");
  }

  async createCart() {
    const carts = await this.readAll();
    const newCart = { id: this.generateNewId(), products: [] };
    carts.push(newCart);
    await this.writeAll(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.readAll();
    return carts.find((c) => String(c.id) === String(cid)) || null;
  }

  async addProduct(cartId, productId, quantity = 1) {
    const carts = await this.readAll();
    const idx = carts.findIndex((c) => String(c.id) === String(cartId));
    if (idx === -1) return null;

    const cart = carts[idx];
    const prodIdx = cart.products.findIndex((item) => String(item.product) === String(productId));

    if (prodIdx === -1) {
      cart.products.push({ product: String(productId), quantity: Number(quantity) || 1 });
    } else {
      cart.products[prodIdx].quantity += Number(quantity) || 1;
    }

    carts[idx] = cart;
    await this.writeAll(carts);
    return cart;
  }
}

export default CartManager;