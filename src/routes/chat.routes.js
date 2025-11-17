// require
const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { createChat } = require("../controllers/chat.controller");

// router instance
const router = express.Router();

// /api/chat/
router.post("/", authMiddleware.authUser,createChat);

module.exports = router;
 