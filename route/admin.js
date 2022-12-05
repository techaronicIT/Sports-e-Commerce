const express = require('express');
const router = express.Router();


const adminController = require("../controllers/admin");
const middleware = require("../middleware/authenticateUser");

router.post('/signup',adminController.admin_signup);
router.post('/login',adminController.admin_login);
router.put('/update',middleware.authenticateToken,adminController.admin_update);
router.get('/get-admin',middleware.authenticateToken,adminController.get_admin);

module.exports=router;