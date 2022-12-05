const express = require('express');
const router = express.Router();


const storeController = require("../controllers/store");
const middleware = require("../middleware/authenticateUser");

router.post("/register",middleware.authenticateToken,storeController.register_store);
router.get("/get",storeController.get_store);                       //this api is added additionally
router.put("/edit",middleware.authenticateToken,storeController.edit_store);  //added /:storeId
router.put("/delete",middleware.authenticateToken,storeController.delete_store);   //added /:storeId
router.put("/add_user/:storeId",middleware.authenticateToken,storeController.add_user_to_store);
router.delete("/remove-access-to",middleware.authenticateToken,storeController.remove_access);


module.exports=router;