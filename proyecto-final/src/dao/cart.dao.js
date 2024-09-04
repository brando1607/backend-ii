import { cartModel } from "../model/cart.model.js";
import { userModel } from "../model/user.model.js";
import { productModel } from "../model/products.model.js";

export class CartDao {
  static async getById({ id }) {
    try {
      return await cartModel.findById(id);
    } catch (error) {
      if (error.messageFormat === undefined) {
        return `Cart not found`;
      }
      console.error(error);
    }
  }
  static async create({ tokenData }) {
    try {
      const user = await userModel.findOne({ email: tokenData.email });

      if (!tokenData) {
        return `User not found, must be logged in to create cart`;
      }
      const userHasCart = user.cart ? true : false;

      if (userHasCart) {
        return `User already has a cart`;
      } else {
        const newCart = await cartModel.create({ products: [] });
        user.cart = newCart._id;
        user.save();
        return `Cart created`;
      }
    } catch (error) {
      console.error(error);
    }
  }
  static async delete({ id }) {
    try {
      await cartModel.findByIdAndDelete(id);

      const cartOwner = await userModel.findOne({ cart: id });
      cartOwner.cart = null;
      cartOwner.save();
      return `cart deleted`;
    } catch (error) {
      if (error.messageFormat === undefined) {
        return `Cart not found`;
      }
      console.error(error);
    }
  }
  static async addProduct({ tokenData, body }) {
    try {
      const user = await userModel.findOne({ email: tokenData.email });
      const cartId = user.cart;
      const userCart = await cartModel.findById({ _id: cartId });

      const product = {
        name: body.name,
        price: body.price,
        stock: body.stock,
      };
      const productExists = await productModel.findOne({ name: product.name });

      if (!productExists) {
        const result = { message: `Product doesn't exist in inventory` };
        return result;
      }

      const isThisProductInCart = userCart.products.filter(
        (e) => e._id.toString() === productExists.id
      );

      if (isThisProductInCart.length > 0) {
        const productIndex = userCart.products.findIndex(
          (e) => e._id.toString() === productExists.id
        );

        if (userCart.products[productIndex].quantity === productExists.stock) {
          return `Amount in cart exceeds stock, product can't be added`;
        } else {
          userCart.products[productIndex].quantity += 1;
          await userCart.save();
        }
      } else {
        userCart.products.push(productExists._id);
        await userCart.save();
      }
      const result = {
        message: "product added",
        cart: userCart,
      };
      return result;
    } catch (error) {
      console.error(error);
    }
  }
  static async removeProduct({ params }) {
    const { productId, amountToRemove, cartId } = params;

    try {
      const userCart = await cartModel.findById(cartId);

      const itemToRemove = await productModel.findById(productId);

      if (!userCart || !itemToRemove) {
        const result = "product or cart not found";
        return { message: result };
      }

      const productIndex = userCart.products.findIndex(
        (e) => e._id.toString() === itemToRemove._id.toString()
      );

      if (amountToRemove < 1) {
        const result = `Amount to remove has to be at least one.`;
        return { message: result };
      }

      const productIsInCart = userCart.products.filter(
        (e) => e._id.toString() === productId
      );

      if (productIsInCart.length === 0) {
        const result = "product not in cart";
        return { message: result };
      }

      if (Number(amountToRemove) > userCart.products[productIndex].quantity) {
        const result =
          "amount to remove can't be higher than the amount of the product in the cart";
        return { message: result };
      }

      userCart.products[productIndex].quantity -= Number(amountToRemove);

      //update amount of products in cart

      const updatedProductsInCart = userCart.products.filter(
        (e) => e.quantity > 0
      );

      userCart.products = updatedProductsInCart;
      userCart.save();

      if (userCart.products.length === 0) {
        const result = {
          message:
            "cart has been emptied. Go back to the home page to add more",
          userCart,
        };
        return result;
      }
      const result = { message: `${amountToRemove} item(s) removed from cart` };
      return result;
    } catch (error) {
      console.error(error);
    }
  }
  static async purchase({ id }) {
    try {
      const userCart = await cartModel.findById(id);

      if (!userCart) return { message: "cart not found" };

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

      const result = { message: "purchase completed" };
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
