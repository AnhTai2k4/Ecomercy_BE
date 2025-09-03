const mongoose = required("mongoose");

const productScheme = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: String, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
  },
  {
     timestamps:true
  }
);

const Product = mongoose.model("Product", productScheme);
module.exports = Product;
