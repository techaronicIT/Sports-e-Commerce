const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,

    },
    specifications: {
      brand: {
        type: String,
        trim: true,
      },
      model: {
        type: String,
        trim: true,
      },
      colors: [
        {
          color: {
            type: String,
          },
          isPrimary: {
            type: Boolean,
            default: false,
          },
          isDeleted: {
            type: Boolean,
            default: false,
          },
          deletedAt: {
            type: Date,
            default: null,
          },
        },
      ],
    },
    HSNCODE: {
      type: String,
    },
    SKU: {
      type: String,
    },
    barCode: {
      type: String,
    },
    category: {
      type: ObjectId,
      ref: "category",
    },
    subCategory: {
      type: ObjectId,
      ref: "subCategory",
    },
    measurementUnit: {
        weight: {
          type: String,
          enum: [
            "kg",
            "gm",
            "ml",
            "ltr",
            "nos",
            "pcs",
            "dozen",
            "bunch",
            "bundle",
            "pack",
            "bag",
            "box",
            "carton",
            "jar",
            "bottle",
            "can",
            "packet",
            "roll",
            "tube",
            "spool",
            "coil",
            "drum",
            "barrel",
            "bale",
            "sack",
            "cartoon",
            "pouch",
            "tin",
            "cylinder",
            "cask",
            "crate",
            "tray",
            "bowl",
            "basket",
            "bucket",
            "bag",
            "bottle",
            "jar",
            "can",
            "box",
            "carton",
            "packet",
            "roll",
            "tube",
            "spool",
            "coil",
            "drum",
            "barrel",
            "bale",
            "sack",
            "cartoon",
            "pouch",
            "tin",
            "cylinder",
            "cask",
            "crate",
            "tray",
            "bowl",
            "basket",
            "bucket",
            "ton",
          ],
          trim: true,
        },
        dimension: {
          height: {
            type: String,
          },
          width: {
            type: String,
          },
          length: {
            type: String,
          },
        },
        size: {
          type: String,
          enum: [
            "m",
            "l",
            "s",
            "x",
            "xs",
            "xx",
            "xxl",
            "xl",
            "3xl",
            "4xl",
            "meter",
            "cm",
            "mm",
            "inch",
            "feet",
          ],
         
         
        },
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    discountPercent: {
      type: Number,
    },
    discountPrice: {
      type: Number,
      default: function () {
        console.log("discountPrice", this.price - this.price * (this.discountPercent / 100));
        return this.price - (this.price * this.discountPercent) / 100;
      },
    },
    tag: {
      type: String,
      default: "new",
    },
    qualityCheck: {
      check: {
        type: Boolean,
        default: false,
      },
      // checkedBy: {
      //   type: ObjectId,
      //   ref: "admin",
      // },
      checkedAt: {
        type: Date,
        default: null,
      },
      quality: {
        type: String,
        enum: ["good", "bad", "average", "excellent", "poor", "fair"],
        default: "good",
      },
    },
    images: [
      {
        image: {
          type: String,
          required: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
        isDeleted: {
          type: Boolean,
          default: false,
        },
        deletedAt: {
          type: Date,
          default: null,
        },
      },
    ],
    videos: [
      {
        video: {
          type: String,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
        isDeleted: {
          type: Boolean,
          default: false,
        },
        deletedAt: {
          type: Date,
          default: null,
        },
      },
    ],
    quantity: {
      type: Number,
      trim: true,
      default: 0,
    },
    addedBy: {
      type: ObjectId,
      ref: "admin",
    },

    deletedAt: {
      // when the product is been deleted
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("product", productSchema);



// productSchema.virtual("discountPrice").get(function () {
//   return this.price - (this.price * this.discountPercent) / 100;
// }).set(function (v) {
//   this.discountPrice = v;
// });
