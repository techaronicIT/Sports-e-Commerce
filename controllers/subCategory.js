const subCategoryModel = require("../model/subCategory");
const adminModel = require("../model/admin");

exports.createSubCategory = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!(await adminModel.findById(userId))) {
      return res.status(401).json({ message: "Unauthorized request" });
    }
    return res.status(201).json({
      data: (await subCategoryModel.create({
        subCategoryName: req.body.subCategoryName,
        category: req.body.category,
        addedBy: userId,
      }))
        ? "Sub Category created successfully"
        : "Sub Category not created",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get all sub categories

exports.getAllSubCategories = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Sub Categories fetched successfully",
      data: await subCategoryModel
        .find(
          { isDeleted: false },
          {
            subCategoryName: 1,
          }
        )
        .populate({
          path: "category",
          select: "categoryName",
          populate: {
            path: "addedBy",
            select: "firstName  email",
          },
        }),
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
