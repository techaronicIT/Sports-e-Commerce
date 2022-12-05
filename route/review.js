const express = require('express');
const router = express.Router();



const reviewController = require("../controllers/review.js");
//const middleware = require("../middleware/authenticateUser");


router.post("/create",reviewController.reviewCreate)


module.exports = router;