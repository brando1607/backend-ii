import { Router } from "express";
import { CartController } from "../controller/cart.controller.js";

export const cartRouter = Router();

cartRouter.delete(
  "/:productId/:amountToRemove/:cartId/remove-product",
  CartController.removeProduct
);

cartRouter.post("/:id/purchase", CartController.purchase);

cartRouter.post("/add-to-cart", CartController.addProduct);

cartRouter.delete("/:id", CartController.delete);

cartRouter.post("/create", CartController.create);

cartRouter.get("/:id", CartController.getById);
