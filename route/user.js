const express = require('express');
const router = express.Router();


const subAdminController = require("../controllers/user");
const middleware = require("../middleware/authenticateUser");

router.post('/signup',subAdminController.subAdmin_signup);
router.post('/login',subAdminController.subAdmin_login);
// router.put('/update',middleware.authenticateToken,subAdminController.subAdmin_update);
router.put('/delete_account',middleware.authenticateToken,subAdminController.delete_subAdmin);

module.exports=router;