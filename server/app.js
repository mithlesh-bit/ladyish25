const express = require("express");
const cors = require("cors");
const compression = require("compression");
require("dotenv").config();
const axios = require("axios");

const error = require("./middleware/error.middleware");
const rateLimit = require("express-rate-limit");

const app = express();

// Middleware
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.set("trust proxy", 1);

// Rate Limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/", limiter);

// CORS Configuration
const allowedOrigins = [
  "https://ladyish.vercel.app",
  "http://localhost:3000",
  "https://www.ladyish.in",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

/* router level connections */
app.use("/api/custom", require("./routes/customDesign.route"));
app.use("/api/enquiry", require("./routes/enquiry.route"));
app.use("/api/brand", require("./routes/brand.route"));
app.use("/api/category", require("./routes/category.route"));
app.use("/api/product", require("./routes/product.route"));
app.use("/api/store", require("./routes/store.route"));
app.use("/api/user", require("./routes/user.route"));
app.use("/api/cart", require("./routes/cart.route"));
app.use("/api/favorite", require("./routes/favorite.route"));
app.use("/api/review", require("./routes/review.route"));
app.use("/api/payment", require("./routes/payment.route"));
app.use("/api/purchase", require("./routes/purchase.route"));
app.use("/api/corousel", require("./routes/corousel.route"));
app.use("/api/address", require("./routes/address.route"));
app.use("/api/coupon", require("./routes/coupon.route"));

app.get("/", (req, res) => {
  res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: "The request is OK",
  });
});

// Payment Route
app.post("/create-order", async (req, res) => {
  const clientId = process.env.CASHFREE_APP_ID;
  const clientSecret = process.env.CASHFREE_SECRET_KEY;

  try {
    const response = await axios.post(
      "https://production.cashfree.com/pg/orders",
      {
        customer_details: {
          customer_id: req.body.customer_id,
          customer_email: req.body.customer_email,
          customer_phone: req.body.customer_phone,
          customer_name: req.body.customer_name,
        },
        order_id: `Order_${new Date().getTime()}`,
        order_amount: req.body.order_amount,
        order_currency: "INR",
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": clientId,
          "x-client-secret": clientSecret,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
     console.error(
       "Error creating order:",
       error.response ? error.response.data : error.message
     );
    res.status(500).json({ error: "Internal server error" });
  }
});

// Global Error Handling
app.use(error);

module.exports = app;
