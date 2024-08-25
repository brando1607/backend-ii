import { cartModel } from "../model/cart.model.js";
import { productModel } from "../model/products.model.js";
import { userModel } from "../model/user.model.js";
import { verifyToken } from "../utils/jwt.js";
import { getUserGart } from "../utils/reusable-functions.js";

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
      const { name, amount, price } = req.body;
      const productsInCart = [req.body];

      const userCart = await getUserGart(
        req,
        verifyToken,
        userModel,
        cartModel
      );

      userCart.products.splice(0);
      await userCart.save();

      // const promises = [productsInCart[0].name].flat().map(async (e) => {
      //   const productName = [e.name].flat();
      //   const amountToSell = [e.amount].flat();

      //   const product = await productModel.findOne({ name: productName });

      //   product.stock -= amountToSell;
      //   return await product.save();
      // });

      const productsSample = req.body.products;
      // console.log(productsSample);

      const promises = productsSample.map(async (e) => {
        const product = await productModel.findOne({ name: e.name });
        product.stock -= e.amount;
        return product.save();
      });

      await Promise.all(promises);

      // console.log(promises);

      // console.log(productsSample);

      // const promises = [productsInCart[0].name].flat().map(async (e) => {
      //   const productName = e;
      // });

      // for (let i = 0; i < [productsInCart[0].name].flat().length; i++) {
      // const productName = [productsInCart[0].name].flat()[i];
      // const amountToSell = [productsInCart[0].amount].flat()[i];
      // const product = await productModel.findOne({ name: productName });
      // product.stock -= amountToSell;
      // await product.save();
      // await productModel.findOneAndUpdate(
      //   { name: productName },
      //   { stock: product.stock - amountToSell }
      // );
      // }

      res.redirect("/checkout");
    } catch (error) {
      console.error(error);
    }
  }
}
