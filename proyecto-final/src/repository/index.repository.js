import { GetDaos } from "../dao/index.dao.js";
import { ProductRepository } from "./products.repository.js";
import { AuthtRepository } from "./auth.repository.js";
import { CartRepository } from "./cart.repository.js";
import { UserRepository } from "./user.repository.js";

export class GetRepositories {
  static productRepository = new ProductRepository(GetDaos.productDao);
  static authRepository = new AuthtRepository(GetDaos.authDao);
  static carRepository = new CartRepository(GetDaos.cartDao);
  static userRepository = new UserRepository(GetDaos.userDao);
}
