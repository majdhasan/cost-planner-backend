const Expense = require("../models/expense.model");

const expenseController = {};

expenseController.create = async (req, res, next) => {
  const { amount, description, date } = req.body;
  const newExpense = new Expense({
    amount,
    description,
    date,
    creator: req.user,
  });
  try {

    const saved = await newExpense.save();
    return res.send({
      success: true,
      expense: saved,
    });
  } catch (e) {
    next(e);
  }
};

expenseController.get = async (req, res, next) => {
  const { user, } = req;
  const month = parseInt(req.params.month);

  const now = new Date();

  if (month && month >= 0 && month <= 11) {
    now.setMonth(month)
  }
  console.log(now);

  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const query = {
    creator: user._id,
    date: {
      $gte: firstDay,
      $lt: lastDay
    }
  };
  console.log(query);

  try {
    const results = await Expense.find(query).sort({ date: "desc" });
    return res.send({
      results,
    });
  } catch (e) {
    next(e);
  }

  console.log(results);
};

expenseController.destroy = async (req, res, next) => {
  const expense_id = req.params.id;

  try {
    const check = await Expense.findOne({ _id: expense_id });
    if (!check.creator.equals(req.user._id)) {
      const err = new Error("This expense object does not belong to you");
      err.status = 401;
      throw err;
    }
    const response = await Expense.deleteOne({ _id: expense_id });
    return res.send({ response });
  } catch (e) {
    next(e);
  }
};

expenseController.update = async (req, res, next) => {
  const expense_id = req.params.id;
  const { amount, date, description } = req.body;

  try {
    const check = await Expense.findOne({ _id: expense_id });
    if (!check.creator.equals(req.user._id)) {
      const err = new Error("This expense object does not belong to you");
      err.status = 401;
      throw err;
    }
    const result = await Expense.update(
      { _id: expense_id },
      { amount, date, description }
    );
    return res.send({ result });
  } catch (e) {
    next(e);
  }
};

module.exports = expenseController;
