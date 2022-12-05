const categoryModel = require("../model/category");
const adminModel = require("../model/admin");

// Add a new category
exports.add_category = async (req, res) => {
  try {
    const userId = req.user.userId;
    const validUser = await adminModel.findOne({ _id: userId });
    if (!validUser) {
      return res.status(400).send({ message: "You are not authorized" });
    }
    const { categoryName } = req.body;
    const category = await categoryModel.findOne({
      categoryName: categoryName,
    });

    if (category) {
      return res.status(400).send({ message: "category already exist" });
    }
    const newCategory = await categoryModel.create({
      categoryName: categoryName,
      addedBy: userId,
    });
    return res.status(200).send({ message: "category added" });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//   Get all categories
exports.get_categories = async (req, res) => {
  try {
    const categories = await categoryModel
      .find(
        { isDeleted: false },
        {
          categoryName: 1,
          addedBy: 1,
          _id: 1,
        }
      )
      .populate("addedBy", "email");
    if (!categories) {
      return res.status(404).send({ message: "no categories found" });
    }
    return res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
// Delete a category with the specified categoryId in the request
exports.delete_category = async (req, res) => {
  try {
    const userId = req.user.userId;
    const validUser = await adminModel.findOne({ _id: userId });
    if (!validUser) {
      return res.status(400).send({ message: "You are not authorized" });
    }
    const categoryId = req.body.categoryId;
    const category = await categoryModel.findOne({ _id: categoryId });
    if (!category) {
      return res.status(404).send({ message: "category not found" });
    }
    await category.updateOne({ isDeleted: true });
    return res.status(200).send({ message: "category deleted" });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Update a category with the specified categoryId in the request
exports.update_category = async (req, res) => {
  try {
    const userId = req.user.userId;
    const validUser = await adminModel.findOne({
      _id: userId,
    });
    if (!validUser) {
      return res.status(400).send({ message: "You are not authorized" });
    }
    const { categoryId, categoryName } = req.body;
    const category = await categoryModel.findOne({
      _id: categoryId,
    });
    if (!category) {
      return res.status(404).send({ message: "category not found" });
    }
    await category.updateOne({
      categoryName: categoryName,
    });
    return res.status(200).send({ message: "category updated" });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// get a specific category by id or name
exports.get_single_category = async (req, res) => {
  try {
    const categoryId  = req.body.categoryId;
    const  categoryName  = req.body.categoryName;
    categoryId
      ? res.status(200).send({
        message: "category found",
        category: await categoryModel.findOne({
          _id: categoryId,
        }, {_id:1, categoryName:1})
        })
      : categoryName
      ? res.status(200).send({
        message: "category found",
        category: await categoryModel.findOne({
          categoryName: categoryName,
        }, { _id: 1, categoryName: 1 })
      })
      : res.status(404).send({ message: "category not found" });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
