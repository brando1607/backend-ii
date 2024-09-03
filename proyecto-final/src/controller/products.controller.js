import { GetRepositories } from "../repository/index.repository.js";
import { verifyToken } from "../utils/jwt.js";

export class ProductsController {
  static async create(req, res) {
    const tokenData = verifyToken(req.cookies.token);

    const { name, price, stock } = req.body;

    if (!tokenData) return res.send(`can't create product if not logged in`);

    if (!name || !price || !stock) {
      return res.send("All elements are required");
    }

    const product = {
      name,
      price,
      stock,
      seller: `${tokenData.first_name} ${tokenData.last_name}`,
    };
    const newProduct = await GetRepositories.productRepository.create(product);
    // res.redirect("/");
    return res.status(200).send({ message: "product created", newProduct });
  }
  static async getAll(req, res) {
    try {
      const products = await GetRepositories.productRepository.getAll();

      return res.status(200).send(products);
    } catch (error) {
      console.error(error);
    }
  }
  static async getById(req, res) {
    const { id } = req.params;
    try {
      const product = await GetRepositories.productRepository.getById({ id });
      return res.status(200).send(product);
    } catch (error) {
      console.error(error);
    }
  }
}
