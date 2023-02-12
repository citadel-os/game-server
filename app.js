const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const Pool = require('pg').Pool;
const citadelRoute = require("./routes/citadel");
const gridRoute = require("./routes/grid");
const raidRoute = require("./routes/raid");
require('dotenv').config();

// env variables
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;

const app = express();
app.use(cors());

const pool = new Pool({
  user: DB_USERNAME,
  host: DB_HOST,
  database: 'citadel',
  password: DB_PASSWORD,
  port: 5432,
});

app.locals.pool = pool;

app.get("/", (req, res) => res.status(200).json({
  status: true,
  message: "server running"
}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/citadel", citadelRoute);
app.use("/api/v1/grid", gridRoute);
app.use("/api/v1/raid", raidRoute);

app.use((req, res, next) => {
  next(createError(404));
});


app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.status(err.status || 400);
  res.json({ error: err.message, message: "operation failed" });
});

console.log("server starting on port 3000");
app.listen(3000);

module.exports = app;



