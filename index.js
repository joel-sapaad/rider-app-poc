require("dotenv").config({ path: ".env" });
const express = require("express");
const morgan = require("morgan")
const app = express();
const path = require("path");
app.use(morgan("tiny"))
app.use(express.static(path.join(__dirname, "dist")));

const server = app.listen(process.env.PORT, () => {
  console.log(`APP listening on PORT ${process.env.PORT}`);
});
