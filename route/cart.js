const express = require('express');
const router = express.Router();


const cartController = require("../controllers/cart");
const middleware = require("../middleware/authenticateUser");

router.post("/makeOrder",middleware.authenticateToken,cartController.add_cart);
router.put("edit-cart",middleware.authenticateToken,cartController.edit_cart);
router.get('/get-cart',middleware.authenticateToken,cartController.get_cart);
router.delete('/remove_from_cart',middleware.authenticateToken,cartController.delete_cart);

module.exports = router;
