// src/dao/ProductManagerMongo.js
import { ProductModel } from "./models/product.model.js";

export default class ProductManagerMongo {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    const filter = {};

    // query: por categoría o disponibilidad
    // Por ejemplo: query=category:electronics o query=status:true
    if (query) {
      const [field, value] = query.split(":");
      if (field === "category" && value) {
        filter.category = value;
      } else if (field === "status" && value !== undefined) {
        filter.status = value === "true";
      } else {
        // si no viene en formato field:value, asumimos que es categoría
        filter.category = query;
      }
    }

    const options = {
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      lean: true
    };

    if (sort === "asc" || sort === "desc") {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    const result = await ProductModel.paginate(filter, options);
    return result; // lo formateamos en el router para el response final
  }

  async getProductById(id) {
    return ProductModel.findById(id).lean();
  }

  async addProduct(data) {
    return ProductModel.create(data);
  }

  async updateProduct(id, data) {
    return ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProduct(id) {
    return ProductModel.findByIdAndDelete(id);
  }
}
