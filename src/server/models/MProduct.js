import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  cantity: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    default: 1,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
