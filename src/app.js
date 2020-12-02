const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const v1 = require("./routes/v1");
const passport = require("passport");
const cors = require('cors');

const app = express();
// app.use(router);

// ------------ DB Config --------------//
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

mongoose.connect(
  process.env.URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    err
      ? console.log(err)
      : console.log("Successfuly connected to the database");
  }
);

// ------------ Middleware --------------//
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors())
require("./config/passport")(passport);

// ------------ Routes --------------//
app.use("/api/v1", v1);

// ------------ Errors --------------//

app.use((req, res, next) => {
  //404 Not Found
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use((err, req, res, next) => {
  const status = err.status || 500;
  const error = err.message || 'Error processing your request';

  res.status(status).send({
    error,
  });
});

module.exports = app;
