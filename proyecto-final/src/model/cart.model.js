import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
});

//middlewares

// cartSchema.post("save", async function () {
//   try {
//     const products = this.products.filter((e) => e.quantity > 0);
//     this.products = products;
//     await this.save();
//   } catch (error) {
//     console.error(error);
//   }
// });

export const cartModel = mongoose.model("cart", cartSchema);
