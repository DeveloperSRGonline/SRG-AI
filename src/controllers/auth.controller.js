// require
const userModel = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// "/register" endpoint logic here
// it accept req and give response
async function registerUser(req, res) {
  // extracting details from request body {destructing the body data}
  const {
    fullName: { firstName, lastName },
    email,
    password,
  } = req.body;

  // First, we check whether a user with the provided email already exists.
  // it give boolean value
  const isUserAlreadExists = await userModel.findOne({ email });

  // if we get user
  if (isUserAlreadExists) {
    res.status(400).json({ message: "User already exists" });
  }

  // before we create user we need to encrypt our password using bcrypt
  const encryptedPassword = await bcrypt.hash(password, 10);

  // if user not exist then we create user
  // await because it take time to create user
  const user = await userModel.create({
    fullName: { firstName, lastName },
    email,
    password: encryptedPassword,
  });

  // after user create we need to create token to validate user next time
  const generatedToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

  // after token generated we store that token in cookies
  res.cookie("token", generatedToken);

  // at the end finally we send res that user registered successfully
  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  });
}

// "/login" endpoint logic here
async function loginUser(req, res) {
  // extracting data from request body {destructing}
  const { email, password } = req.body;

  // check user exist or not
  const user = await userModel.findOne({ email });

  // if user not exist
  if (!user) {
    return res.status(404).json({ message: "Invalid credentials" });
  }

  // if user exist then we check password
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  // if password not matched
  if (!isPasswordMatched) {
    return res.status(404).json({ message: "Invalid credentials" });
  }

  // at last if password match
  const generatedToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

  // then we save token in cookie
  res.cookie("token", generatedToken);

  // finally after user logined send response
  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
  });
}

// export all controllers
module.exports = {
  registerUser,
  loginUser,
};
