import { Router } from "express";
import { UserController } from "../controller/user.controller.js";

export const userRouter = Router();

//rutas de usuario

userRouter.get("/", UserController.getAll);

userRouter.get("/:id", UserController.getById);

userRouter.delete("/delete/:id", UserController.delete);

userRouter.put("/:id", UserController.update);

userRouter.get("/logout", UserController.logout);
