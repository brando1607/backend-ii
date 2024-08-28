import { Router } from "express";
import { verifyToken } from "../utils/jwt.js";
import { productModel } from "../model/products.model.js";
import { cartModel } from "../model/cart.model.js";
import { userModel } from "../model/user.model.js";

export const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
  const loggedIn = req.cookies.token ? true : false;
  const products = await productModel.find().lean();
  const thereAreProducts = products.length > 0;

  res.render("index", {
    products,
    thereAreProducts,
    loggedIn,
  });
});

viewsRouter.get("/register", (req, res) => {
  const loggedIn = req.cookies.token ? true : false;

  if (loggedIn) {
    return res.redirect("/current");
  }
  res.render("register", { title: "Registro" });
});

viewsRouter.get("/registerError", (req, res) => {
  res.render("registerError");
});

viewsRouter.get("/login", (req, res) => {
  const loggedIn = req.cookies.token ? true : false;

  if (loggedIn) {
    return res.redirect("/current");
  }
  return res.render("login", { title: "Inicie sesión" });
});

viewsRouter.get("/loginError", (req, res) => {
  res.render("loginError");
});

viewsRouter.get("/current", (req, res) => {
  const loggedIn = req.cookies.token ? true : false;
  const tokenData = verifyToken(req.cookies.token);

  if (!loggedIn) {
    return res.redirect("/");
  }

  const seller = tokenData.role === "seller";
  return res.render("current", {
    seller,
    user: tokenData,
    title: `Profile`,
  });
});

viewsRouter.get("/change-password", (req, res) => {
  return res.render("restore", { title: "change password" });
});

viewsRouter.get("/add-products", (req, res) => {
  if (!req.cookies.token) {
    return res.redirect("/");
  }

  const user = verifyToken(req.cookies.token);
  const seller = user.role === "seller";

  if (!seller) {
    return res.redirect("/current");
  }
  res.render("add-products");
});

viewsRouter.get("/product-added", (req, res) => {
  return res.render("product-added", { title: "Virtual store" });
});

viewsRouter.get("/cart", async (req, res) => {
  const tokenData = verifyToken(req.cookies.token);

  const user = await userModel.findOne({ email: tokenData.email });
  const cartId = user.cart;
  const userCart = await cartModel.findById({ _id: cartId });

  const products = await Promise.all(
    userCart.products.map(async (e) => {
      return {
        product: await productModel.findById(e._id).lean(),
        quantity: e.quantity,
      };
    })
  );

  const productsDetails = products.map((e) => {
    return {
      product: e.product,
      quantity: e.quantity,
      totalToPay: e.product.price * e.quantity,
    };
  });

  const productsInCart = productsDetails.filter((e) => e.quantity > 0);
  const cartIsEmpty = productsInCart.length === 0 ? true : false;

  let totalInCart = 0;

  productsDetails.forEach((e) => {
    totalInCart += e.totalToPay;
  });

  return res.render("cart", { productsDetails, totalInCart, cartIsEmpty });
});

viewsRouter.get("/product-removed", (req, res) => {
  return res.render("product-removed", { title: "Virtual Store" });
});

viewsRouter.get("/checkout", (req, res) => {
  res.render("checkout");
});
