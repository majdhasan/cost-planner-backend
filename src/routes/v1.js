const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const expenseController = require("../controllers/expense.controller");
const passport = require("passport");

router.post("/register", userController.register);
router.post("/auth", userController.login);

router.all("*", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err || !user) {
      const error = new Error("You are not authorized to access this path");
      error.status = 401;
      throw error;
    }
    req.user = user;
    return next();
  })(req, res, next);
});

// -------------------- Restricted Routes ----------//

// router.get("/expense", expenseController.getExpenses);
router.get("/expense", expenseController.get);
router.post("/expense", expenseController.create);
router.delete("/expense/:id", expenseController.destroy);
router.put("/expense/:id", expenseController.update);

module.exports = router;
