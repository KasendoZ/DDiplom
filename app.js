require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const path = require("path");
const ejs = require('ejs');
const port = process.env.PORT || 8000;
const mongoose = require('mongoose');
const flash = require('connect-flash');
var session = require('express-session');
const mongoDbsession = require('connect-mongodb-session')(session)
const cookieParser = require('cookie-parser')

// MongoDB холболт
mongoose.connect(process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
    console.log("DB connected!!!!!");
}).catch((error) => {
    console.log(error);
})

//****** Flash message тохиргоо */
const store = new mongoDbsession({
  uri: process.env.SESSION_URI, 
  collection: 'mySessions',
});

app.use(session({
  secret: 'this is my secretkey',
  resave: false,
  cookie: { maxAge: 1000 * 60 },
  saveUninitialized: true,
  store: store,
}))

app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// ========== хэрэгтэй router-ууд =========== //

const index_router = require("./routers/index");
const products_router = require("./routers/products");
const warehouse_router = require("./routers/warehouse");
const staff_router = require("./routers/staff");
const customer_router = require("./routers/customer");
const supplier_router = require("./routers/supplier");
const all_purchases_router = require("./routers/all_purchases");
const purchases_return_router = require("./routers/purchases_return");
const all_sales_router = require("./routers/all_sales");
const sales_return_router = require("./routers/sales_return");
const adjustment_router = require("./routers/adjustment");
const transfer_router = require("./routers/transfer");
const all_expenses_router = require("./routers/expenses");
const stock_report_router = require("./routers/stock_report");
const payment_report = require("./routers/payment_report")
const all_report = require("./routers/report")
const master_shop = require("./routers/master_settings")

const profile_router = require("./routers/profile");

const sing_up_router = require("./routers/sing_up");
const login_router = require("./routers/login");

// ========== router-уудыг тодорхойлох =========== //

app.use("/", index_router);
app.use("/products", products_router);
app.use("/warehouse", warehouse_router);
app.use("/staff", staff_router);
app.use("/customer", customer_router);
app.use("/supplier", supplier_router);
app.use("/all_purchases", all_purchases_router);
app.use("/purchases_return", purchases_return_router);
app.use("/all_sales", all_sales_router);
app.use("/sales_return", sales_return_router);
app.use("/adjustment", adjustment_router);
app.use("/transfer", transfer_router);
app.use("/all_expenses", all_expenses_router);
app.use("/stock_report", stock_report_router);
app.use("/payment_report", payment_report);
app.use("/report", all_report);
app.use("/master_shop", master_shop);

app.use("/profile", profile_router);
app.use("/", sing_up_router);
app.use("/", login_router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
