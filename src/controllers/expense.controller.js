const jwt = require("jsonwebtoken");
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
  const { user } = req;

  const query = { creator: user._id };

  try {
    const results = await Expense.find(query);
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
