import { productModel } from "../model/products.model.js";
import { verifyToken } from "../utils/jwt.js";

export class ProductsController {
  static async create(req, res) {
    const tokenData = verifyToken(req.cookies.token);

    const { name, price, stock } = req.body;

    if (!name || !price || !stock) {
      return res.send("All elements are required");
    }

    await productModel.create({
      name,
      price,
      stock,
      seller: `${tokenData.first_name} ${tokenData.last_name}`,
    });
    res.redirect("/");
  }
}
