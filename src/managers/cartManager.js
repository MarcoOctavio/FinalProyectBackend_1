import fs from "fs/promises";
import crypto from "crypto";

export default class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.pathFile, "utf-8");
      return JSON.parse(data || "[]");
    } catch {
      await fs.writeFile(this.pathFile, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
  }

  async #writeFile(data) {
    await fs.writeFile(this.pathFile, JSON.stringify(data, null, 2), "utf-8");
  }

  generateId() {
    return crypto.randomUUID();
  }

  async createCart() {
    const carts = await this.#readFile();
    const newCart = { id: this.generateId(), products: [] };
    carts.push(newCart);
    await this.#writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.#readFile();
    return carts.find(c => c.id === id) || null;
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const carts = await this.#readFile();
    const cart = carts.find(c => c.id === cartId);
    if (!cart) throw new Error("Carrito no encontrado.");

    const item = cart.products.find(p => p.product === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await this.#writeFile(carts);
    return cart;
  }
}
