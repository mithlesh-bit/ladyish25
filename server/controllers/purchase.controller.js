const purchaseService = require("../services/purchase.service");
const User = require("../models/user.model");
const Purchase = require("../models/purchase.model");
const Product = require("../models/product.model");
const Address=require("../models/address.model")
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587, // Use port 587 for non-secure connection
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "ladyishcrochet@gmail.com",
    pass: "iutq grpj fqjq chbu",
  },
});
// ebug: true,
// logger: true,

const sendMail = async (productsHtml, result, transporter, nam, to, from) => {
  const mailOptions = {
    from: { name: from.name, address: from.address },
    to: to,
    subject: "Order Status Update",
    text: `<p><strong>Current Status:</strong> ${result.status}</p>`,
    html: `<!DOCTYPE html>
<html>
<head>
    <style>
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
    <div class="email-body">  
        <p>Dear ${nam},</p>
        <p>Your order ID is <strong>${result.orderId}</strong><p>
        <p>We are pleased to inform you about the current status of your order.</p>
        <p>Current Status : <strong>${result.status}</strong></p>
        <p>Please be assured that we are making every effort to process your order efficiently. Further updates will be provided as your order progresses through our system.</p>
        <p><strong>Order Date:</strong> ${result.createdAt}</p>
        <p><strong>Order Total:</strong> ₹ ${result.totalAmount}/- (Including Delivery Charges)</p>
        <!-- Product details section -->
     <!-- Product details section -->
        <table class="product-list">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                ${productsHtml}
            </tbody>
        </table>
       <p>If you have any queries please contact us at:</p>

    <!-- Contact buttons -->
   
                <a href="mailto:contact.ladyish@gmail.com" style="background-color: #87CEFA; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px; margin-right: 10px;">
                   Email Us
                </a>
           
        
    <p>Have a wonderful day!</p>
       <a href="https://instagram.com/ladyish.in" style="background-color: #DE3163; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px;">
                    <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" style="vertical-align: middle; width: 20px; height: 20px; margin-right: 8px;">Follow us on Instagram
                </a>
    <h2>Team Ladyish</h2>
    </div>
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

exports.getAllPurchases = async (req, res, next) => {
  try {
    await purchaseService.getAllPurchases(res);
  } catch (error) {
    next(error);
  } finally {
    //// console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

exports.getPurchasesSeller = async (req, res) => {
  try {
    const purchases = await Purchase.find();

    const reversedPurchases = purchases.reverse();

    res.status(200).json({
      success: true,
      count: reversedPurchases.length,
      data: reversedPurchases,
    });
  } catch (error) {
    // Handle potential errors
    res.status(500).json({
      success: false,
      message: "Failed to retrieve purchases",
      error: error.message,
    });
  }
};

exports.updatePurchaseStatus = async (req, res, next) => {
  try {
    // Update the purchase status
    const statusUpdate = await purchaseService.updatePurchaseStatus(
      req.params.id,
      req.body.status
    );

    if (!statusUpdate) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Find the customer details
    const existingUser = await User.findById(statusUpdate.data.customerId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userEmail = existingUser.email;
    const userName = existingUser.name;

    const productsHtml1 = await Promise.all(
      statusUpdate.data.products.map(async (product) => {
        try {
          const productDetails = await Product.findById(product.product);
          if (!productDetails) {
            throw new Error("Product not found");
          }

          return `<tr>
                    <td class="product-image"><img src="${productDetails.thumbnail.url}" alt="Product Image" style="width:100px; height:100px; object-fit: cover; border-radius: 5px;"></td>
                    <td>${productDetails.title}</td>
                    <td>${product.quantity}</td>
                    <td>₹ ${productDetails.price}</td>
                  </tr>`;
          return `<tr>
                  <td class="product-image"><img src="${
                    productDetails.thumbnail.url
                  }" alt="Product Image" style="width:100px; height:100px; object-fit: cover; border-radius: 5px;"></td>
                  <td>${productDetails.title}</td>
                  <td>${product.quantity}</td>
                  <td>₹ ${productDetails.price}</td>
                  <td>₹ ${product.quantity * productDetails.price}</td>
                </tr>`;
        } catch (error) {
          console.error("Error fetching product details:", error);
          return `<tr>
                    <td>${product.product}</td>
                    <td>${product.quantity}</td>
                    <td>Error fetching details</td>
                  </tr>`;
        }
      })
    ).then((rows) => rows.join(""));

    await sendMail(
      productsHtml1,
      statusUpdate.data,
      transporter,
      userName,
      userEmail,
      {
        name: "Ladyish",
        address: "ladyishcrochet@gmail.com",
      }
    );
    return res.status(200).json(statusUpdate);
  } catch (error) {
    next(error);
  }
};

exports.addPurchase = async (req, res, next) => {
  const { userId } = req.params;
  const { productId, quantity, price } = req.body;
  ``;

  try {
    const newPurchase = new Purchase({
      productId,
      quantity,
      price,
      user: userId,
    });

    await newPurchase.save();

    //// console.log(8546);

    const product = await Product.findOne({ _id: productId });
    product.buyers.push(userId);
    const user = await User.findById(userId);
    user.purchases.push(newPurchase);
    await user.save();

    res
      .status(201)
      .send({ message: "Purchase added successfully", data: newPurchase });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add purchase", error: error.message });
  }
};

exports.orders10Seller = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Fetch orders and populate the customer field
    const orders = await Purchase.find({})
      .sort({ _id: -1 }) // Newest orders first
      .skip(skip)
      .limit(Number(limit))
      .populate("customer"); // Populating the customer field

    const totalOrders = await Purchase.countDocuments();

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalOrders / limit),
      data: orders, // Now it returns orders with populated customer details
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params; // Extract the order ID from the route parameter

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required" });
    }

    // Fetch the order and populate customer and product details
    let order = await Purchase.findById(id)
      .populate("customer")
      .populate("products.product");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Convert the Mongoose document to a plain JavaScript object
    order = order.toObject();

    // Fetch the address using the address ID from the order
    const address = await Address.findById(order.address);

    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    // Attach the plain JavaScript address object to the order
    order.address = address.toObject();

    // Return the full order details with the populated address
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order details",
      error: error.message,
    });
  }
};




