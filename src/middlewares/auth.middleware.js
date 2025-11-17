// require essential
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authUser(req, res, next) {
  // extracting token from the cokie
  const { token } = req.cookies;

  // if token not found then
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized!",
    });
  }

  // then we verify token if token found
  try {
    // verifying token using jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // decoded get the id then we find that user using that id
    const user = await userModel.findById(decoded.id);
    // setting user in the req.user
    req.user = user;
    next();
  } catch (error) {
    // if we get any error in above process
    res.status(401).json({
      message: "Unauthorized!",
    });
  }
}

// finally export the auth function
module.exports = { authUser };
