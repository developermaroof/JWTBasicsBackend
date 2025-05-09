const { BadRequestError } = require("../errors");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const login = async (req, res) => {
  // create a user
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError("Please provide both username and password");
  }

  const user = await User.create({ username, password });

  const token = jwt.sign(
    { userId: user._id, username },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.status(200).json({ msg: "User Created", token });
};

const dashboard = async (req, res) => {
  console.log(req.user);

  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `Hello ${req.user.username}`,
    secret: `Here is your authorized data, Your Lucky Number is ${luckyNumber}`,
  });
};

module.exports = { login, dashboard };
