import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { viewsRouter } from "./routes/views.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import { _dirname } from "./dirname.js";
import path from "path";

//Express config
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//handlebars config
app.engine("hbs", handlebars.engine({ extname: "hbs", defaultLayout: "main" }));
app.set("view engine", "hbs");
app.set("views", path.join(_dirname, "views"));
handlebars.create({ strict: false });

//mongo config
mongoose
  .connect(
    "mongodb+srv://brandodavid16:brando16@coderhouse.sjxaxsx.mongodb.net/?retryWrites=true&w=majority&appName=coderHouse"
  )
  .then(() => console.log("DB connected"))
  .catch((error) => console.log({ error: error.message }));

//router config
app.use("/", viewsRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);

//passport config
initializePassport();
app.use(passport.initialize());

//Servidor
app.listen(3000, () => {
  console.log(`Server listening on port http://localhost:3000`);
});
