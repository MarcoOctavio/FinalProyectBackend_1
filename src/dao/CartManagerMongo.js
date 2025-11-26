// src/dao/CartManagerMongo.js
import { CartModel } from "./models/cart.model.js";

export default class CartManagerMongo {
  async createCart() {
    return CartModel.create({ products: [] });
  }

  async getCartById(id) {
    // populate para traer productos completos
    return CartModel.findById(id).populate("products.product").lean();
  }

  async addProductToCart(cid, pid, quantity = 1) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const item = cart.products.find(p => p.product.toString() === pid);

    if (item) {
      item.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
    await cart.save();
    return cart;
  }

  async removeProductFromCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    return cart;
  }

  async updateCartProducts(cid, products) {
    // products: [{ product: "id", quantity: 2 }, ...]
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    cart.products = products.map(p => ({
      product: p.product,
      quantity: p.quantity || 1
    }));
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return null;

    item.quantity = quantity;
    await cart.save();
    return cart;
  }

  async clearCart(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart;
  }
}
