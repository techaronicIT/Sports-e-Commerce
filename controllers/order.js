const orderModel = require("../model/order");
const cartModel = require("../model/cart");
const userModel = require("../model/customer");
const productModel = require("../model/product");

exports.make_order = async (req, res) => {
  try {
    const cartId = req.body.cartId;
    const cartData = await cartModel.findOne({ _id: cartId });
    if (!cartData)
      return res.status(400).send({ message: "This cart dose not exist" });
    const cartCheck = cartData.items.length;
    if (cartCheck == 0)
      return res
        .status(404)
        .send({ message: "no product exist add product to make order" });
    const { userId, items, totalPrice, totalItems } = cartData;
    let totalQuantity = 0;
    const totalItem = items.length;
    for (let i = 0; i < totalItem; i++)
      totalQuantity = totalQuantity + Number(items[i].quantity);
    const orderRequest = {
      userId,
      items,
      totalPrice,
      totalItems,
      totalQuantity,
    };
    const orderData = await orderModel.create(orderRequest);
    return res
      .status(201)
      .send({ message: "order placed successfully", OrderDetail: orderData });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.cancel_order = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const Order = await orderModel.findOne({ _id: orderId, isDeleted: false })
    if (!Order) {
        return res.status(400).send({ status:false, message: 'order id not correct ' })
    } 
    const cancelledOrder = await orderModel.findOneAndUpdate(
      { _id: orderId },
      { isDeleted: true, deletedAt: Date(), status: "cancelled" },
      { new: true }
    );
    console.log("error")
    return res
      .status(200)
      .send({
        message: "order has been cancelled successfully",

        Cancelled_Order: cancelledOrder
        
      });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.generate_invoice = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const orderData = await orderModel.findOne({ _id: orderId });
    if (!orderData)
      return res.status(400).send({ message: "This order dose not exist" });
    const { userId, items, totalPrice, totalItems } = orderData;
    let totalQuantity = 0;
    const totalItem = items.length;
    for (let i = 0; i < totalItem; i++)
      totalQuantity = totalQuantity + Number(items[i].quantity);
    
    let user = req.user;
    // Getting user Details
    let userData = await userModel.findOne({ _id: user.userId },{_id:0,password:0,__v:0,isDeleted:0,createdAt:0,updatedAt:0});
    const userName = userData.firstName + " " + userData.lastName;
    const {email,phone,address} = userData;
    const userShippingAddress= address.shipping,
    userBillingAddress = address.billing;

    const addressDetails = {userBillingAddress,userShippingAddress};

    // Get product Details
    let productData = await productModel.find({ _id: { $in: items.map((item) => item.productId) } });
    const productList = productData.map((product) => {
      return {
        productId: product._id,
        productName: product.productName,
        price: product.price,
      };
    }
    );
    const invoiceRequest = {
      orderId,
      userName,
      email,
      phone,
      addressDetails,      
      productList,
      totalPrice,
      totalItems,
      totalQuantity,
    };
    
    return res
      .status(201)
      .send({ message: "invoice generated successfully", Invoice: invoiceRequest });
  } catch (err) {
    return res.status(500).send(err.message);
  }

};

exports.fetchHistoryBetweenTwoDateWithProductId =  async (req, res) => {  

  try {
      let productId=req.body.productId
      if(!(productId)){
          return res.status(400).send({status:false,msg:"product id is not valid"})
      }
      let countOfProduct =await orderModel.find({isDeleted : false }).count()
      let  getproducts=await orderModel.find({items:{
        $elemMatch:{productId:req.body.productId}
      }})  //check this line

      if(!getproducts){
          return res.status(404).send({status:false,msg:"this product are not avilable"})
      }
      if(getproducts.isDeleted==true){
          return res.status(200).send({status:true,msg:"product is already deleted"})
      }
      return res.status(200).send({status:true,"count" :countOfProduct, msg:"data",data:getproducts})    
  } catch (error) {
      return res.status(500).send({status:false,msg:error.message})     
  }
}