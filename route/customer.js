const express = require('express');
const router = express.Router();


const userController = require("../controllers/customer");
const middleware = require("../middleware/authenticateUser");

router.post('/signup',userController.user_signup);
router.post('/login',userController.login);
router.post('/update',middleware.authenticateToken,userController.userUpdate);
router.post('/email_otp',userController.send_otp_toEmail);
// router.post('/mobile_otp',userController.send_otp_toPhone);
// a Comment is added here


module.exports=router;