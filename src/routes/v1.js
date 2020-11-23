const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const passport = require("passport");

router.post("/register", userController.register);
router.post("/auth", userController.login);
router.get(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.send("You are authenticated");
  }
);

module.exports = router;
