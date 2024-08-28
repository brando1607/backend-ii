import { Router } from "express";
import passport from "passport";
import { passportCall } from "../middlewares/passport.middleware.js";
import { AuthController } from "../controller/auth.controller.js";
import { UserController } from "../controller/user.controller.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/user/register-fail",
  }),
  AuthController.register
);

authRouter.get("/register-fail", AuthController.registerFail);

authRouter.post(
  "/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/api/auth/login-error",
  }),
  AuthController.login
);

authRouter.get("/login-error", AuthController.loginError);

authRouter.post("/change-password", UserController.changePassword);

authRouter.get(
  "/current",
  passportCall("jwt", { session: false }),
  AuthController.current
);
