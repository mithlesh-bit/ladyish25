const axios = require('axios');

const APP_ID = process.env.PAYMENT_APP_ID
const SECRET_KEY = process.env.PAYMENT_SECREATE_KEY
const BASE_URL = 'https://sandbox.cashfree.com';  // Use the production URL for live integration

// Order creation function
async function createOrder(orderDetails) {
    try {
        const response = await axios.post(`${BASE_URL}/pg/orders`, orderDetails, {
            headers: {
                'x-client-id': APP_ID,
                'x-client-secret': SECRET_KEY,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error(
          "Error creating order:",
          error.response ? error.response.data : error.message
        );
    }
}

// Function to get payment session ID
async function getPaymentSessionId(orderId, orderAmount) {
    const orderDetails = {
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: 'INR',
        customer_details: {
            customer_id: 'cust_12345',
            customer_name: 'John Doe',
            customer_email: 'john.doe@example.com',
            customer_phone: '9876543210'
        },
        order_meta: {
            return_url: 'http://localhost:3000/return?order_id={order_id}',
            notify_url: 'hhttp://localhost:3000/webhook'
        }
    };

    const order = await createOrder(orderDetails);
    return order ? order.payment_session_id : null;
}



async function initiatePayment(orderId, orderAmount) {
    const paymentSessionId = await getPaymentSessionId(orderId, orderAmount);
    if (paymentSessionId) {
        const checkoutUrl = `https://payments.cashfree.com/checkout/post/submit?payment_session_id=${paymentSessionId}`;
       
    }
}

// Usage example
initiatePayment("order_12345", 100.0);
