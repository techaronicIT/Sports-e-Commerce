const express = require('express');
const router = express.Router();

const middleware = require("../middleware/authenticateUser");
const subCategoryController = require("../controllers/subCategory");

router.post("/create", middleware.authenticateToken, subCategoryController.createSubCategory);
router.get("/get-all",subCategoryController.getAllSubCategories);

module.exports = router;