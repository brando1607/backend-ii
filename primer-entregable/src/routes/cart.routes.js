import { Router } from "express";
import { CartController } from "../controller/cart.controller.js";

export const cartRouter = Router();

cartRouter.post("/remove-item", CartController.removeItems);

cartRouter.post("/check-out", CartController.checkOut);
