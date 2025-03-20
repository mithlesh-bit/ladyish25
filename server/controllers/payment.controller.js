

const Razorpay = require("razorpay");
const crypto = require("crypto");
const verify = require("../middleware/verify.middleware");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const Product = require("../models/product.model");
const Purchase = require("../models/purchase.model");
const nodemailer = require("nodemailer");
const axios = require("axios");
const Cart = require("../models/cart.model");


exports.postOrder = async (req, res, next) => {
  const clientId = process.env.CASHFREE_APP_ID;
  const clientSecret = process.env.CASHFREE_SECRET_KEY;

  try {
    const USER = await User.findById(req.user._id);

    const response = await axios.post(
      "https://api.cashfree.com/pg/orders", //sandbox
      {
        customer_details: {
          customer_id: req.user._id,
          customer_email: req.user.email,
          customer_phone: USER.phone,
          customer_name: req.user.name,
        },
        order_id: req.body.orderId,
        order_amount: req.body.orderAmount,
        order_currency: req.body.orderCurrency,
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
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587, // Use port 587 for non-secure connection
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "ladyishcrochet@gmail.com",
    pass: "iutq grpj fqjq chbu",
  },
  ebug: true,
  logger: true,
});

exports.orderValidate = async (req, res, next) => {
  const { orderId, address, products, amount } = req.body;

  try {
    // Fetch payment details from Cashfree
    const paymentResponse = await fetch(
      //`https://sandbox.cashfree.com/pg/orders/${orderId}`,

      `https://api.cashfree.com/pg/orders/${orderId}`,

      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        },
      }
    );

    if (!paymentResponse.ok) {
      console.error("Failed to retrieve payment details.");
      throw new Error("Failed to retrieve payment details.");
    }

    const paymentData = await paymentResponse.json();
    const razorpay_order_id = paymentData.cf_order_id;
    const {
      //razorpay_signature,
      userToken,
      giftMessage,
      address,
      products,
      amount,
    } = req.body;

    // Fetch user details
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ status: "error", msg: "User not found" });
    }

    // Create a new purchase record
    const purchaseData = {
      customer: user._id,
      products,
      customerId: user._id,
      orderId: razorpay_order_id,
      address,
      giftMessage: giftMessage,
      totalAmount: amount,
      status: "Ordered",
    };

    const newPurchase = await Purchase.create(purchaseData);
    if (!newPurchase) {
      console.error("Failed to create purchase");
      throw new Error("Failed to create purchase");
    }

    // Extract product IDs from `products` array
    const productIds = products.map((p) => p.product);

    // Find the Cart items to be removed
    const cartItemsToRemove = await Cart.find({
      user: user._id,
      product: { $in: productIds },
    });

    // Extract the Cart IDs
    const cartIdsToRemove = cartItemsToRemove.map((item) => item._id);

    // Remove the Cart IDs from the user's `cart` array
    const data = await User.findByIdAndUpdate(user._id, {
      $pullAll: { cart: cartIdsToRemove },
    });
    // Update products with the user as a buyer
    const productsAll = await Product.find({ _id: { $in: productIds } });
    await Promise.all(
      productsAll.map(async (product) => {
        product.buyers.push(user._id);
        await product.save();
      })
    );

    // Update user's purchase history
    user.purchases.push(newPurchase._id);
    await user.save();
    // Send email notification

    // Sending the email with today's date as orderDate
    const totalAmount = amount;

    // console.log("Order validated and user updated with new purchase");
    res.status(200).json({
      status: "success",
      msg: "Payment verified and order stored successfully",
      orderDetails: {
        orderId: razorpay_order_id,
        purchaseId: newPurchase._id,
      },
    });

    sendMail(transporter, user.name, user.email, razorpay_order_id, amount, {
      name: "Ladyish",
      address: "ladyishcrochet@gmail.com",
    });
  } catch (error) {
    // console.log("Server error during validation:", error.message);
    return res.status(500).json({
      status: "error",
      msg: "Server error during validation",
      error: error.message,
    });
  }
};

const sendMail = async (transporter, from, to, orderId, totalAmount) => {
  const today = new Date();
  const mailOptions = {
    from: { name: from.name, address: from.address },
    to: to,
    subject: "Order Confirmation",
    html: `<!DOCTYPE html>
<html>
<head>
    <style>
body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        color: #333;
    }
    .header {
        text-align: center;
        margin-bottom: 20px;
    }
    .header img {
        width: 100px; /* Adjust based on your specific logo size */
    }
    .status-circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: inline-block;
    }
         header {
            padding: 20px;
            font-size: 1.5rem;
        }
        h1 {
            margin-top: 30px;
            font-size: 2rem;
        }
        .confirmation-section img {
            width: 200px;
            margin: 20px auto;
        }
        .details {
            font-size: 1rem;
            margin-top: 20px;
        }
        .details strong {
            color: #555;
        }
   
    .order-summary {
        background-color: #F2F7FF;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .order-details {
        margin-top: 20px;
    }
    .footer {
        text-align: center;
        margin-top: 30px;
    }

        .email-body {
            font-family: Arial, sans-serif;
            color: #333;
            padding: 20px;
        }
        .product-list {
            border-collapse: collapse;
            width: 100%;
        }
        .product-list th, .product-list td {
            text-align: left;
            padding: 8px;
        }
        .product-list th {
            background-color: #f2f2f2;
        }
        .product-image img {
            width: 50px; /* Adjust size as needed */
            height: 50px; /* Adjust size to maintain aspect ratio */
            border-radius: 10px; /* Rounded corners */
        }
    </style>
</head>

<body>

<header>
     <img src="https://res.cloudinary.com/dxaey2vvg/image/upload/v1721414817/orange_professional_restaurant_food_instagram_post_1_n1aw1e.png"  alt="Ladyish Logo" style="height:50px; width:50px;">
     <!-- Instagram Icon -->
  <div style="position: absolute; top: 20px; right: 20px;">
     <a href="https://instagram.com/ladyish.in" target="_blank" aria-label="Instagram">
         <img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/instagram@2x.png" alt="Instagram Logo" style="width: 24px; height: 24px;">
     </a>
     <a href="https://x.com/Ladyishh_" target="_blank" aria-label="Twitter">
         <img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-dark-gray/twitter@2x.png" alt="Twitter Logo" style="width: 24px; height: 24px;">
     </a>
 </div>
 

    </header>

    <!-- Confirmation Section -->
    <h1>Thank You for Your Purchase!</h1>
   

    <!-- Order Details Section -->
    <div class="details">
        <p><strong>· Order ID:</strong>${orderId}</p>
        <p><strong>· Order Date:</strong>${
          today.toISOString().split("T")[0]
        }</p>
        <p><strong>· Order Total:</strong>₹${totalAmount}</p>
        <p><strong>· Order Status:</strong>Order Placed✅</p>
  
    </div>

<div class="order-summary">
    
    <p>If you have any queries please contact us at:</p>

    <!-- Contact buttons -->
    <a href="mailto:contact.ladyish@gmail.com" style="background-color: #87CEFA; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px; margin-right: 10px;">
       Email Us
    </a>
     
    
</div>

<p>** This is an auto-generated email. Please do not reply to this email.**</p>
</body>
</html>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
