import fs from "fs/promises";
import crypto from "crypto";

export default class ProductManager {
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

  async getProducts() {
    return await this.#readFile();
  }

  async addProduct(newProduct) {
    const products = await this.#readFile();

    if (products.some(p => p.code === newProduct.code)) {
      throw new Error("El código del producto ya existe.");
    }

    const product = {
      id: this.generateId(),
      status: true,
      thumbnails: [],
      ...newProduct
    };

    products.push(product);
    await this.#writeFile(products);
    return product;
  }

  async updateProduct(id, updates) {
    const products = await this.#readFile();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Producto no encontrado.");

    products[index] = { ...products[index], ...updates };
    await this.#writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.#readFile();
    const filtered = products.filter(p => p.id !== id);
    await this.#writeFile(filtered);
    return filtered.length !== products.length;
  }
}
