import { Router } from "express";
import passport from "passport";
import { userModel } from "../model/user.model.js";
import { UserController } from "../controller/user.controller.js";

export const userRouter = Router();

//rutas de usuario
userRouter.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/user/register-fail",
  }),
  UserController.register
);

userRouter.get("/register-fail", UserController.registerFail);

userRouter.delete("/delete/:id", UserController.delete);
