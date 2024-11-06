import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { mocksRouter } from "./routes/mocks.routes.js";
import { productsRouter } from "./routes/products.routes.js";

export class RouterIndex {
  static authRouter = authRouter;
  static userRouter = userRouter;
  static cartRouter = cartRouter;
  static mocksRouter = mocksRouter;
  static productsRouter = productsRouter;
}
