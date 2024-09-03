import { GetDaos } from "../dao/index.dao.js";
import { ProductRepository } from "./products.repository.js";

export class GetRepositories {
  static productRepository = new ProductRepository(GetDaos.productDao);
}
