const reviewModel = require("../model/review");
const productModel = require("../model/product")
const userModel = require("../model/user");

exports.reviewCreate = async function (req, res) {
try{
    const data = req.body;
    console.log(data);
    let productId = req.body.productId
    const userId = req.user.userId;
    const userData = await userModel.findOne({ _id: userId });
    if (!userData) {
      return res.status(400).send({ message: "You are not authorized" });
    }
    let product = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!product) {
        return res.status(400).send({ status: false, msg: "product not exists" })
    }
    let rating = req.body.rating
    if (!rating)
        return res.status(400).send({ status: false, msg: " please give rating" })
        if(!(data.rating>0 && data.rating<=5)) return res.status(400).send({ status: false, msg: "rating should be in between 1 to 5" })
            
    let savedReview = await reviewModel.create(data)

    return res.status(201).send({ "status": true, "msg": savedReview });
}
catch (error) {
    console.log(error)
    return res.status(500).send({ status: false, msg: error.message })
}
}
