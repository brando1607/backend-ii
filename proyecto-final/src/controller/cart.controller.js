import { cartModel } from "../model/cart.model.js";
import { productModel } from "../model/products.model.js";
import { userModel } from "../model/user.model.js";
import { verifyToken } from "../utils/jwt.js";
import { getUserCart } from "../utils/reusable-functions.js";

export class CartController {
  static async create(req, res) {
    const tokenData = verifyToken(req.cookies.token);
    const user = await userModel.findOne({ email: tokenData.email });
    try {
      if (!tokenData) {
        return res
          .status(404)
          .send(`User not found, must be logged in to create cart`);
      }
      const userHasCart = user.cart ? true : false;

      if (userHasCart) {
        return res.send(`User already has a cart`);
      } else {
        const newCart = await cartModel.create({ products: [] });
        user.cart = newCart._id;
        user.save();
        return res.status(200).send(`Cart created`);
      }
    } catch (error) {
      console.error();
    }
  }
  static async addProduct(req, res) {
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

      const isThisProductInCart = userCart.products.filter(
        (e) => e._id.toString() === productExists.id
      );

      if (isThisProductInCart.length > 0) {
        const productIndex = userCart.products.findIndex(
          (e) => e._id.toString() === productExists.id
        );

        if (userCart.products[productIndex].quantity === productExists.stock) {
          return res.send(
            `Amount in cart exceeds stock, product can't be added`
          );
        } else {
          userCart.products[productIndex].quantity += 1;
          await userCart.save();
        }
      } else {
        userCart.products.push(productExists._id);
        await userCart.save();
      }

      // return res.redirect("/product-added");
      return res.status(200).send({ message: "product added", userCart });
    } catch (error) {
      console.error(error);
    }
  }

  static async removeProduct(req, res) {
    try {
      const { product, amount } = req.body;

      const userCart = await getUserCart(
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

      if (removeAllProducts) {
        userCart.products.splice(productIndex, 1);
        userCart.save();
      } else {
        userCart.products[productIndex].quantity -= 1;
        userCart.save();
      }

      // return res.status(200).redirect("/product-removed");
      return res.status(200).send({ message: "product(s) removed", userCart });
    } catch (error) {
      console.error(error);
    }
  }
  static async purchase(req, res) {
    try {
      const userCart = await cartModel.findById(req.params.id);

      const promises = userCart.products.map(async (e) => {
        return await productModel.findById(e._id);
      });

      const productsInCart = await Promise.all(promises);

      //update stock

      productsInCart.forEach(async (purchase) => {
        const product = userCart.products.find(
          (p) => p._id.toString() === purchase._id.toString()
        );

        purchase.stock -= product.quantity;
        await purchase.save();
      });

      userCart.products.splice(0);
      await userCart.save();

      // res.redirect("/checkout");
      return res.status(200).send({ message: "purchase completed" });
    } catch (error) {
      console.error(error);
    }
  }
  static async delete(req, res) {
    const { id } = req.params;

    try {
      await cartModel.findByIdAndDelete(id);

      const cartOwner = await userModel.findOne({ cart: id });
      cartOwner.cart = null;
      cartOwner.save();
      return res.send(`cart deleted`);
    } catch (error) {
      console.error();
    }
  }
}
