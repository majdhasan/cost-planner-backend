const mongoose = require("mongoose");
const { Schema } = mongoose;

const ExpenseSchema = Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Expense = mongoose.model("Expense", ExpenseSchema);
module.exports = Expense;
