import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import { config } from "./config/config.js";

//Express config
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//mongo config
mongoose
  .connect(config.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((error) => console.log({ error: error.message }));

//router config
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);

//passport config
initializePassport();
app.use(passport.initialize());

//Servidor
app.listen(config.PORT, () => {
  console.log(`Server listening on port http://localhost:${config.PORT}`);
});
