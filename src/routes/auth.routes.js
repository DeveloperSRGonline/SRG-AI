// require
const express = require("express");
const authController = require("../controllers/auth.controller");

// router creation
const router = express.Router();

// api as per task
// post Because registration sends data from frontend to backend

// register api
router.post("/register", authController.registerUser);

// login api
router.post('/login',authController.loginUser)


//  exporting router
module.exports = router;
