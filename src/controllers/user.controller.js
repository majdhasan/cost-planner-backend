const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const userController = {};
/**
 * Sign up Logic
 */

userController.register = async (req, res, next) => {
  const { name, email, password, joined } = req.body;

  const newUser = new User({
    name,
    email,
    password,
    joined,
  });

  try {
    const user = await newUser.save();
    return res.send({ user });
  } catch (e) {
    console.log(e);
    if (e.name === "MongoError" && e.code === 11000) {
      next(new Error(`Email address ${newUser.email} is already taken`));
    } else {
      next(e);
    }
  }
};

userController.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error(`The email ${email} was not found in our system`);
      err.status = 401;
      return next(err);
    }
    user.isPasswordMatch(password, user.password, (err, matched) => {
      if (matched) {
        // return res.send("you may login");
        const secret = process.env.SECRET;
        const expire = process.env.EXPIRE;

        const token = jwt.sign({ _id: user._id }, secret, {
          expiresIn: expire,
        });
        return res.send({ token });
      }
      res.status(401).send({ error: "Invalid username/password combination" });
    });
  } catch (e) {
    next(e);
  }
};

userController.me = async (req, res, next) => {
  const { user } = req;
  res.send({ user });


}

module.exports = userController;
