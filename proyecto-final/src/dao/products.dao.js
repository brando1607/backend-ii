import { productModel } from "../model/products.model.js";

export class ProductDao {
  static async getAll() {
    try {
      return await productModel.find();
    } catch (error) {
      console.error(error);
    }
  }
  static async getById({ id }) {
    try {
      const product = await productModel.findById(id);
      return product;
    } catch (error) {
      if (error.messageFormat === undefined) {
        return `Product not found`;
      }
      console.error(error);
    }
  }
  static async create(product) {
    try {
      const result = await productModel.create(product);
      return { message: "product created", result };
    } catch (error) {
      console.error(error);
    }
  }
}
