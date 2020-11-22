const express = require("express");
const router = express.Router();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(router);
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});

module.exports = app;
