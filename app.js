const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const Pool = require('pg').Pool;
const citadelRoute = require("./routes/citadel");
const { application } = require("express");


const app = express();
app.use(cors());


const pool = new Pool({
  user: 'max',
  host: '80.78.22.142',
  database: 'citadel',
  password: 'bugbox',
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


app.use((req, res, next) => {
  next(createError(404));
});


app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.status(err.status || 400);
  res.json({ error: err.message, message: "operation failed" });
});

console.log("server starting on port 8000");
app.listen(8000);

module.exports = app;



