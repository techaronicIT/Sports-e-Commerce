const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
  {
    wishListName: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("wishList", wishListSchema);
