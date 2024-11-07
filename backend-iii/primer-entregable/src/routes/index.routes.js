import { authRouter } from "./auth.routes.js";
import { userRouter } from "./user.routes.js";
import { cartRouter } from "./cart.routes.js";
import { mocksRouter } from "./mocks.routes.js";
import { productsRouter } from "./products.routes.js";

export class RouterIndex {
  static authRouter = authRouter;
  static userRouter = userRouter;
  static cartRouter = cartRouter;
  static mocksRouter = mocksRouter;
  static productsRouter = productsRouter;
}
