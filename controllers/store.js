const adminModel = require("../model/admin");
const storeModel = require("../model/store");
const userModel = require("../model/user");
const generator = require("generate-password");

exports.register_store = async (req, res) => {
  try {
    let adminId = req.user;
    // console.log(adminId.userId);
    adminId = adminId.userId.trim();
    const { storeName, address } = req.body;
    const id = generator.generateMultiple(1, {
      numbers: true,
      chars: true,
      lowercase: true,
      length: 10,
    });
    const storeId = id[0];
    const storeData = await storeModel.create({
      storeId: storeId.toString(),
      storeName: storeName,
      address: address,
      storeSize :storeSize,
      storeCapacity: storeCapacity,
      adminId: adminId,
    });
    let newStoreId = storeData._id;
    

    try {
      const data= await adminModel.updateOne({ _id: adminId }, { $push: { stores: newStoreId } });
    
    } catch (error) {
      console.log(error);
      
    }
     
    return res
      .status(200)
      .send({
        setting: {
          success: "1",
          message: "store registered successfully",
          data: storeData,
        },
      });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.get_store = async (req, res) => {
  try {
    const storeData = await storeModel.find();
    return res
      .status(200)
      .send({
        setting: {
          success: "1",
          message: "store fetch successfully",
          Data: storeData,
        },
      });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.edit_store = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const storeId = req.body.storeId;
    const adminData = await adminModel.findOne({ _id: adminId });
    if (!adminData) {
      return res
        .status(400)
        .send({ setting: { success: "0", message: "You are not authorized" } });
    }
    const { storeName, address, storeSize, storeCapacity } = req.body;
    const updatedStoreData = await storeModel.findOneAndUpdate(
      { _id: storeId },
      {
        storeName: storeName,
        address : address,
        storeSize: storeSize,
        storeCapacity: storeCapacity,
      },{new:true}
    );
    return res
      .status(201)
      .send({
        setting: {
          success: "1",
          message: "Updated store data",
          newStoreData: updatedStoreData,
        },
      });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.delete_store = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const storeId = req.body.storeId;
    const adminData = await adminModel.findOne({ _id: adminId });
    if (!adminData) {
      return res
        .status(400)
        .send({ setting: { success: "0", message: "You are not authorized" } });
    }
    await storeModel.findOneAndUpdate(
      { _id: storeId },
      { isDeleted: true },
      { new: true }
    );
    return res
      .status(200)
      .send({
        setting: { success: "0", message: "Store Deleted successfully" },
      });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.remove_access = async (req, res) => {
  try {
    const { subAdminId, storeId } = req.body;
    const storeData = await storeModel.updateOne(
      { _id: storeId },
      { $pull: { subAccessor: subAdminId } },
      { new: true }
    );
    return res
      .status(200)
      .send({
        setting: {
          success: "1",
          message: "access remove successfully",
          data: storeData,
        },
      });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.add_user_to_store = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const adminData = await adminModel.findOneAndUpdate({ _id: adminId });
    if (!adminData)
      return res.status(400).send({ message: "You are not authorized" });

    const storeId = req.params.storeId;
    const userId = req.body.userId;
    const userExist = await userModel.findOne({ _id: userId });
    if (!userExist)
      return res.status(400).send({ message: "user dose not exist" });

    const userCredential = { loginId: userId, password: userExist.password };
    const store = await storeModel.updateOne(
      { storeId: storeId },
      { $push: { users: userCredential } }
    );

    return res.status(200).send({ store: store });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
