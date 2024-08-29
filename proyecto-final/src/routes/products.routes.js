import { Router } from "express";
import { ProductsController } from "../controller/products.controller.js";

export const productsRouter = Router();

productsRouter.post("/create-product", ProductsController.create);

productsRouter.get("/", ProductsController.getAll);

productsRouter.get("/:id", ProductsController.getById);
