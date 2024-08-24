import { cartModel } from "../model/cart.model.js";
import { productModel } from "../model/products.model.js";
import { userModel } from "../model/user.model.js";
import { verifyToken } from "../utils/jwt.js";
import { getUserGart } from "../utils/functions.js";

export class CartController {
  static async removeItems(req, res) {
    try {
      const { product, amount } = req.body;

      const userCart = await getUserGart(
        req,
        verifyToken,
        userModel,
        cartModel
      );

      const itemToRemove = await productModel.findOne({ name: product });
      const productIndex = userCart.products.findIndex(
        (e) => e._id.toString() === itemToRemove._id.toString()
      );
      const removeAllProducts = amount ? true : false;

      if (!removeAllProducts) {
        if (userCart.products[productIndex].quantity > 1) {
          userCart.products[productIndex].quantity -= 1;
          userCart.save();
        } else {
          userCart.products.splice(productIndex, 1);
          userCart.save();
        }
      } else {
        userCart.products.splice(productIndex, 1);
        userCart.save();
      }
      return res.status(200).redirect("/product-removed");
    } catch (error) {
      console.error(error);
    }
  }
  static async checkOut(req, res) {
    try {
      const productsInCart = [req.body].flat();

      const userCart = await getUserGart(
        req,
        verifyToken,
        userModel,
        cartModel
      );

      userCart.products.splice(0);
      userCart.save();

      for (let i = 0; i < [productsInCart[0].name].flat().length; i++) {
        const productName = [productsInCart[0].name].flat()[i];
        const amountToSell = [productsInCart[0].amount].flat()[i];

        const product = await productModel.findOne({ name: productName });

        await productModel.findOneAndUpdate(
          { name: productName },
          { stock: product.stock - amountToSell }
        );
      }
      res.redirect("/checkout");
    } catch (error) {
      console.error(error);
    }
  }
}
