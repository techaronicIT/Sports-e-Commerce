const userModel = require("../model/user");
const customerModel = require("../model/customer");
const adminModel = require("../model/admin");
const productModel = require("../model/product");
const categoryModel = require("../model/category");
const subcategoryModel = require("../model/subcategory");

exports.add_product = async (req, res) => {
  try {
    const adminId = req.user.userId;
    if (!(await adminModel.findOne({ _id: adminId }))) {
      return res
        .status(400)
        .send({ message: "Unautherized request!! Please Login First " });
    }
    req.body.adminId = adminId;
    // const discountPrice = req.body.price - (req.body.price * req.body.discountPercent) / 100;
    // req.body.discountPrice = discountPrice;
    const productRequest = req.body;
    const productData = await productModel.create(productRequest);
    return res.status(201).send({
      message: "product added successfully",
      ProductData: productData,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
exports.edit_product = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userData = await adminModel.findOne({ _id: userId });
    const checkAddedBy = await productModel.findOne({ addedBy: userId });
    if (!userData) {
      return res.status(400).send({ message: "Unautherized Request" });
    }
    if (!checkAddedBy) {
      return res
        .status(400)
        .send({ message: "You are not allowed to edit this product" });
    }

    const productId = req.params.productId;
    const {
      brand,
      productName,
      title,
      description,
      subcategory,
      price,
      productType,
    } = req.body;
    const updatedProduct = await productModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      {
        brandName: brandName,
        productName: productName,
        title: title,
        description: description,
        subcategory: subcategory,
        price: price,
        productType: productType,
      }
    );

    if (!updatedProduct)
      return res
        .status(400)
        .send({ message: "product id is invalid or product dos not exist" });

    return res.status(200).send({ updatedProduct });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.get_products = async (req, res) => {
  try {
    const allProduct = await productModel.find({ isDeleted: false }).populate({
      path: "category",
      select: "categoryName",
    });
    return res.status(200).send(allProduct);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.delete_product = async (req, res) => {
  try {
    const userId = req.user;
    const validUser = await userModel.findOne({ _id: userId });
    if (!validUser) {
      return res.status(400).send({ message: "You are not authorized" });
    }

    const productId = req.params.productId;
    await productModel.updateOne({ _id: productId }, { isDeleted: true });

    return res.status(200).send({ message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.get_specific_product = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    const productData = await productModel
      .findOne(
    { _id: productId, isDeleted: false },
    { reviews: { $slice: -3 } }
    )
    .populate({
      path: "category",
      select: "categoryName",
    })
    // console.log(productData);
      // .populate({
      //   path: "subcategory",
      //   select: "subcategoryName",
      // })
      // .populate({
      //   path: "reviews",
      //   populate: {
      //     path: "userId",
      //     select: "firstName lastName",
      //   },
      // });
    if (!productData) {
      return res.status(400).send({ message: "product id is invalid" });
    }
    return res.status(200).send({data:productData});

  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.add_to_wishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const validUser = await customerModel.findOne({ _id: userId });
    if (!validUser) {
      return res.status(400).send({ message: "You are not authorized" });
    }
    const productId = req.body.productId;
    await customerModel.updateOne(
      { _id: userId },
      { $push: { wishlist: productId } }
    );

    return res.status(200).send({ message: "Product added to wishlist" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
exports.remove_from_wishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const validUser = await customerModel.findOne({ _id: userId });
    if (!validUser) {
      return res.status(400).send({ message: "You are not authorized" });
    }
    const productId = req.body.productId;
    await customerModel.updateOne(
      { _id: userId },
      { $pull: { wishlist: productId } }
    );

    return res.status(200).send({ message: "Product removed from wishlist" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.newArivalProduct = async (req, res) => {
  console.log("newArivalProduct");
  try {
    const user = req.user.userId;
    const validUser =
      (await adminModel.findOne({ _id: user })) ||
      (await userModel.findOne({ _id: user }));
    if (!validUser) {
      return res.status(400).send({ message: "You are not authorized" });
    }
    const checkDate = getOneWeekBeforeDate();
    const price = req.body.price;
    if (price >= 50) {
      res.status(200).send(
        await productModel.find({
          price: { $gte: price },
          createdAt: { $gte: checkDate },
        })
      );
    } else {
      res
        .status(500)
        .send("There is no product in this price range and given date");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const getOneWeekBeforeDate = () => {
  var today = new Date();
  var lastWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  return lastWeek;
};

exports.get_products_by_category = async (req, res) => {
  try {
    let category = req.params.category;
    if (category.toString().includes("-")) {
      category = category.replace("-", " ");
    }
    // console.log(category);
    if (category === "other") { 
      return res.status(200).send(await productModel.find());
    }
  
    const categoryData = await categoryModel.find(
      { categoryName: category },
      { _id: 1 }
    );
    if (!categoryData) {
      return res.status(404).send({
        message: "category not found",
      });
    }
    const categoryId = String(categoryData[0]._id);
    const products = await productModel.find({
      category: categoryId,
    });
    if (!products) {
      return res.status(304).send({ message: "no product found" });
    }

    return res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
