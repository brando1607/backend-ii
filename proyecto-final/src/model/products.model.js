import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  stock: {
    type: Number,
    require: true,
  },
  seller: { type: String, required: true },
});

//middlewares

productsSchema.post("save", async function (next) {
  try {
    if (this.stock < 1) {
      await this.constructor.findByIdAndDelete(this._id);
    }
  } catch (error) {
    next(error);
  }
});

export const productModel = mongoose.model("product", productsSchema);
