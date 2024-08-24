import { Router } from "express";
import { ProductsController } from "../controller/products.controller.js";

export const productsRouter = Router();

productsRouter.post("/add-to-cart", ProductsController.add);

productsRouter.post("/save-products", ProductsController.save);
