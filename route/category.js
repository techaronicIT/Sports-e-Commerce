const express = require('express');
const router = express.Router();

// Calling the controllers files for proper routes
const middleware = require("../middleware/authenticateUser");
const categoryController = require('../controllers/category');

router.post('/add_category', middleware.authenticateToken, categoryController.add_category);
router.post('/update_category', middleware.authenticateToken, categoryController.update_category);
router.post('/delete_category', middleware.authenticateToken, categoryController.delete_category);
router.get('/get_category', categoryController.get_categories);
router.get('/get_single_category', categoryController.get_single_category);




module.exports = router;