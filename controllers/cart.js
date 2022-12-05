const cartModel = require("../model/cart");
const productModel = require("../model/product");

exports.add_cart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const isCartExisted = await cartModel.findOne({ userId: userId });
    if (!isCartExisted) {
      var cart = req.body;
      var totalPrice = 0;
      var totalItems = cart.items.length;
      var totalQuantity = cart.items[0].quantity;
      if (totalQuantity < 1) {
        return res
          .status(400)
          .send({
            msg: "There is nothing to add in your cart as your total quantity is zero",
          });
        
      }
      if (totalItems > 1) {
        return res
          .status(400)
          .send({ status: false, msg: "please add one item at a time" });
      }
      let demo = await productModel.findOne({
        _id: cart.items[0].productId,
        isDeleted: false,
      });
      if (!demo) {
        return res
          .status(400)
          .send({ message: "(1). This product is no longer exist" });
      }
      totalPrice = demo.price * cart.items[0].quantity;
      cart.userId = userId;
      cart.totalItems = totalItems;
      cart.totalPrice = totalPrice;
      const cartCreate = await cartModel.create(cart);
      return res.status(201).send({ message: "Success", data: cartCreate });
    } else {
      var cart = req.body;
      var totalItems = cart.items.length;
      var totalQuantity = cart.items[0].quantity;
      if (totalQuantity < 1) {
        return res
          .status(400)
          .send({
            msg: "There is nothing to add in your cart as your total quantity is zero",
          });
      }
      if (totalItems > 1) {
        return res.status(400).send({ msg: "please add one item at a time" });
      }
      let body = {};
      body.val = 0;
      let len = isCartExisted.items.length;
      for (let i = 0; i < len; i++) {
        if (cart.items[0].productId == isCartExisted.items[i].productId) {
          let product = await productModel.findOne({
            _id: cart.items[0].productId,
            isDeleted: false,
          }); // => isdeleted added
          if (!product) {
            return res
              .status(400)
              .send({ message: "(2). This product is no longer exist" });
          }
          isCartExisted.totalPrice =
            Number(isCartExisted.totalPrice) +
            Number(product.price) * Number(cart.items[0].quantity);
          isCartExisted.items[i].quantity =
            Number(isCartExisted.items[i].quantity) +
            Number(cart.items[0].quantity);
          body.val = 1;
          isCartExisted.save();
        }
      }
      if (body.val == 0) {
        const product = await productModel.findOne({
          _id: cart.items[0].productId,
          isDeleted: false,
        }); // => isdeleted added
        if (!product) {
          return res
            .status(400)
            .send({ message: "(3). This product is no longer exist" });
        }
        isCartExisted.items.push(cart.items[0]);
        isCartExisted.totalItems += 1;
        isCartExisted.totalPrice =
          isCartExisted.totalPrice +
          Number(cart.items[0].quantity) * product.price;
        isCartExisted.save();
      }
      return res.status(200).send({ msg: "successFul", data: isCartExisted });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.edit_cart = async (req, res) => {
  try {
    let { cartId, productId, removeProduct } = req.body;
    let checkId1 = ObjectId.isValid(cartId);
    if (!checkId1) {
      return res.status(400).send({ message: "Please Provide a valid cartId" });
    }
    let checkId2 = ObjectId.isValid(productId);
    if (!checkId2) {
      return res
        .status(400)
        .send({ message: "Please Provide a valid productId" });
    }
    let isDBexists = await cartModel.findOne({ _id: cartId });
    if (!isDBexists) {
      return res.status(400).send({ message: "This cart id doesn't exist" });
    }
    if (!(req.userId == isDBexists.userId)) {
      return res.status(400).send({ message: "This cart is not yours" });
    }
    let len = isDBexists.items.length;
    for (let i = 0; i < len; i++) {
      // we are checking that the product that we are sending from request body is exist in our items of cart model
      if (productId == isDBexists.items[i].productId) {
        // the client is suggesting us for decrementation of one quantity of the product from the cart
        if (removeProduct == 1) {
          let product = await productModel.findOne({
            _id: productId,
            isDeleted: false,
          }); // => isdeleted added
          if (!product)
            return res
              .status(400)
              .send({ message: " This product is no longer exist" });
          isDBexists.totalPrice =
            Number(isDBexists.totalPrice) - Number(product.price);
          isDBexists.items[i].quantity -= 1;
          if (isDBexists.items[i].quantity == 0) {
            isDBexists.items.splice(i, 1);
            isDBexists.totalItems -= 1;
          }
          isDBexists.save();
          break;
        } else {
          // the client is suggesting us to remove that particular product from the cart
          let product = await productModel.findOne({
            _id: productId,
            isDeleted: false,
          });
          if (!product)
            return res
              .status(400)
              .send({ message: "This product is no longer exist" });
          isDBexists.totalPrice =
            Number(isDBexists.totalPrice) -
            Number(isDBexists.items[i].quantity) * Number(product.price);
          isDBexists.items.splice(i, 1);
          isDBexists.totalItems -= 1;
          isDBexists.save();
          if (isDBexists.items.length == 0) {
            isDBexists.totalPrice = 0;
            isDBexists.save();
          }
          break;
        }
      }
    }
    return res
      .status(200)
      .send({ message: "cart edited successfully", data: isDBexists });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.get_cart = async (req, res) => {
  try {
    const userId = req.user.uerId;
    const cartData = await cartModel.findOne({ userId: userId });
    const cartChecked = cartData //.items.length;     //(removed this item.length)
    if (cartChecked == 0) {
      return res.status(404).send({ message: "Your cart is empty" });
    } else {
      return res
        .status(200)
        .send({ message: "cart fetch successfully", cart: cartData });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.delete_cart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cartData = await cartModel.findOneAndUpdate(
      { userId: userId },
      { items: [], totalPrice: 0, totalItems: 0 },
      { new: true }
    );
    return res
      .status(200)
      .send({ message: "cart deleted successfully", Cart: cartData });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
