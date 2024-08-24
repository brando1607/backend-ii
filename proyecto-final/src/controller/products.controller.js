import { productModel } from "../model/products.model.js";
import { cartModel } from "../model/cart.model.js";
import { userModel } from "../model/user.model.js";
import { verifyToken } from "../utils/jwt.js";

export class ProductsController {
  static async add(req, res) {
    const tokenData = verifyToken(req.cookies.token);
    try {
      const user = await userModel.findOne({ email: tokenData.email });
      const cartId = user.cart;
      const userCart = await cartModel.findById({ _id: cartId });

      const product = {
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
      };
      const productExists = await productModel.findOne(product);
      if (!productExists) {
        return console.error(`Product doesn't exist`);
      }

      const amountOfProductsInCart = userCart.products.filter(
        (e) => e._id.toString() === productExists.id
      );

      if (amountOfProductsInCart.length > 0) {
        const productIndex = userCart.products.findIndex(
          (e) => e._id.toString() === productExists.id
        );
        userCart.products[productIndex].quantity += 1;
        await userCart.save();
      } else {
        userCart.products.push(productExists._id);
        await userCart.save();
      }

      return res.redirect("/product-added");
    } catch (error) {
      console.error(error);
    }
  }

  static async save(req, res) {
    const { name, price, stock } = req.body;

    if (!name || !price || !stock) {
      return res.send("All elements are required");
    }
    await productModel.create({
      name,
      price,
      stock,
    });
    res.redirect("/");
  }
}
