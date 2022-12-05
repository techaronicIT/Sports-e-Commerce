const subAdminModel = require("../model/user");
const storeModel = require("../model/store");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.subAdmin_signup = async (req, res) => {
  try {
    let { email, password, storeId } = req.body;
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const userData = await subAdminModel.create({
      email: email,
      password: password,
      storeId: storeId,
    });
    const loginId = userData._id;
    const user = { loginId, password };
    await storeModel.findOneAndUpdate(
      { storeId: storeId },
      { $push: { subAdmins: user } }
    );
    return res
      .status(201)
      .send({ message: "Sub Admin data created successfully", userData });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.subAdmin_login = async (req, res) => {
  try {
    const subAdminEmail = req.body.email;
    const subAdminPassword = req.body.password;
    let subAdmin = await subAdminModel.findOne({ email: subAdminEmail });
    if (!subAdmin) {
      return res
        .status(400)
        .send({ message: "email is not valid or user dose not exist" });
    }
    const { _id, password } = subAdmin;
    const validPassword = await bcrypt.compare(subAdminPassword, password);
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid Password" });
    }
    const payload = { userId: _id, email: subAdminEmail };
    const generatedToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "10080m",
    });
    res.header("jwt-token", generatedToken);
    return res
      .status(200)
      .send({
        message: ` you have logged in Successfully`,
        token: generatedToken
      });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// exports.subAdmin_update = async (req, res) => {
//   try {

//     const subAdminData = await subAdminModel.findOne({
//       _id:req.user.userId,
//     });
//     if (!subAdminData) {
//       return res.status(400).send({ message: "You are not authorized" });
//     }
//     let { firstName, lastName, mobileNumber, password, address } = req.body;
//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       password = await bcrypt.hash(password, salt);
//     }
//     if (address) {
//       if (address.street) {
//         subAdminData.address.street = address.street;
//       }
//       if (address.city) {
//         subAdminData.address.city = address.city;
//       }
//       if (address.pinCode) {
//         subAdminData.address.pinCode = address.pinCode;
//       }
//     }
//     const newSubAdminData = await userModel.findOneAndUpdate(
//       { _id: adminData._id },
//       {
//         firstName: firstName,
//         lastName: lastName,
//         email: email,
//         password: password,
//         mobileNumber: mobileNumber,
//         address: subAdminData.address,
//       }
//     );
//     return res
//       .status(201)
//       .send({
//         message: "Sub Admin data updated successfully",
//         UpdatedData: newSubAdminData,
//       });
//   } catch (err) {
//     return res.status(500).send(err.message);
//   }
// };

exports.delete_subAdmin = async (req, res) => {
  try {
    const subAdminData = await subAdminModel.findOne({
      _id: req.user.userId,
    });
    if (!subAdminData) {
      return res.status(400).send({ message: "You are not authorized" });
    }
    await subAdminModel.findOneAndUpdate(
      { _id: req.user.userId },
      { isDeleted: true }
    );
    return res.status(200).send({ message: "sub admin deleted successfully" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
