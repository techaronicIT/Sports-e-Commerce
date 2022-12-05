var createError = require("http-errors");
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var dbCon = require("./lib/db");

const adminRoute = require('./route/admin');
const cartRoute = require("./route/cart");
const productRoute = require("./route/product");
const storeRoute = require("./route/store");
const userRoute = require("./route/user");
const customerRoute = require("./route/customer");
const orderRoute = require("./route/order");
const reviewRoute = require("./route/review");
const categoryRoute = require("./route/category");
const subCategoryRoute = require("./route/subCategory");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, authorization");
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

if (app.get("env") === "development") {
    app.use(logger("dev"));
  }

app.use('/admin', adminRoute);
app.use('/cart',cartRoute);
app.use('/product',productRoute);
app.use('/store',storeRoute);
app.use('/user',userRoute);
app.use('/customer',customerRoute);
app.use('/order',orderRoute);
app.use('/review', reviewRoute);
app.use('/category', categoryRoute);
app.use('/sub-category', subCategoryRoute);

// 



app.use(function (req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

  
    // render the error page
    res.status(err.status || 500);
  });

  
  module.exports = app;