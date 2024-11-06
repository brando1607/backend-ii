import express from "express";
import cookieParser from "cookie-parser";
import { winston } from "./middlewares/winston.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import mongoose from "mongoose";
import { RouterIndex } from "./routes/index.routes.js";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import { env } from "./utils/env.utils.js";

//Express config
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
//mongo config
mongoose
  .connect(env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((error) => console.log({ error: error.message }));

//router config
app.use("/api/user", RouterIndex.userRouter);
app.use("/api/auth", RouterIndex.authRouter);
app.use("/api/products", RouterIndex.productsRouter);
app.use("/api/cart", RouterIndex.cartRouter);
app.use("/api/mocks", RouterIndex.mocksRouter);

//passport config
initializePassport();
app.use(passport.initialize());

//Servidor
app.listen(env.PORT, () => {
  console.log(`Server listening on port http://localhost:${env.PORT}`);
});

//middlewares config
app.use(winston);
app.use(errorHandler);
