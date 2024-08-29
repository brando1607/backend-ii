import { Router } from "express";
import { CartController } from "../controller/cart.controller.js";

export const cartRouter = Router();

cartRouter.post("/remove-item", CartController.removeItems);

cartRouter.post("/purchase", CartController.purchase);

cartRouter.post("/add-to-cart", CartController.add);

cartRouter.delete("/:id", CartController.delete);

cartRouter.post("/create", CartController.create);
