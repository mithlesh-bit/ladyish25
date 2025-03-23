"use client";

import Cart from "@/components/icons/Cart";
import React, { useEffect, useState } from "react";
const axios = require("axios");
const Razorpay = require("razorpay");
import Image from "next/image";
import { useRouter } from "next/navigation";
import thanks from "../../../public/thankyou.json";
import Lottie from "lottie-react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPhone,
  faMapPin,
  faPlus,
  faCity,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

import Trash from "@/components/icons/Trash";
import { useDeleteFromCartMutation } from "@/services/cart/cartApi";
import { toast } from "react-hot-toast";
import Inform from "@/components/icons/Inform";
import { useCreatePaymentMutation } from "@/services/payment/paymentApi";
import { load } from "@cashfreepayments/cashfree-js";

const OrderReview = () => {
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const router = useRouter();

  const [removeFromCart, { isLoading, data, error }] =
    useDeleteFromCartMutation();

  const [selectedAddressId, setSelectedAddressId] = useState("");

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  useEffect(() => {
    if (isLoading) {
      toast.loading("Removing item from cart...", { id: "removeFromCart" });
    }

    if (data) {
      toast.success(data?.description, { id: "removeFromCart" });
    }

    if (error?.data) {
      toast.error(error?.data?.description, { id: "removeFromCart" });
    }

    // Set default address when only one address is present
    if (addresses.length === 1) {
      setSelectedAddressId(addresses[0]._id);
    }

    // Fetch addresses only if user is logged in and addresses haven't been loaded
    if (user._id && addresses.length === 0) {
      fetchAllAddresses();
    }

    const cartValue = user?.cart?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    if (cartValue) {
      if (cartValue > 1000) {
      }
    }
  }, [isLoading, data, error, user._id, addresses.length]); // Only trigger on changes to these specific states

  const [isSdkReady, setIsSdkReady] = useState(false);





  
  const applyCoupon = async (e) => {
    e.preventDefault();
    const cartValue = user?.cart?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/coupon/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            codeName: couponCode.toUpperCase(),
            cartValue,
            category: "general",
          }), // Adjust 'category' as needed
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log(data.discount);
        setDiscount(data.discount);

        setFeedback(`₹ ${data.discount} discount applied successfully!`);
        setIsCouponApplied(true); // Mark coupon as applied
      } else {
        setFeedback(data.message);
        setIsCouponApplied(false);
      }
    } catch (error) {
      setFeedback("An error occurred while applying the coupon");
      setIsCouponApplied(false);
    }
  };

  function waitForCashfree(callback) {
    const maxAttempts = 10;
    let attempts = 0;
    const interval = setInterval(() => {
      if (window.Cashfree) {
        clearInterval(interval);
        callback();
      } else if (attempts++ > maxAttempts) {
        clearInterval(interval);
        console.error("Failed to load Cashfree SDK.");
      }
    }, 300);
  }

  new Promise((resolve) => setTimeout(resolve, 2000));

  const fetchAllAddresses = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/address/user/${user._id}/addresses`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setAddresses(response.data);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      toast.error("Failed to load addresses: " + error.message);
      setLoading(false); // Stop loading in case of error
    }
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };
  const [isProcessing, setIsProcessing] = useState(false);

  const makePayment = () => {
    if (!user?.cart?.length) {
      // Checks if the cart is empty or not initialized
      toast.error("Your cart is empty.");
      return;
    }

    if (addresses.length == 0) {
      // Checks if the address list is empty or not initialized
      toast.error("Please add an address.");
      toggleDialog(); // Assume toggleDialog is defined elsewhere to handle dialog visibility
      return;
    }

    if (selectedAddressId == "") {
      toast.error("Please select an address.");
      return;
    }
    setIsProcessing(true);

    paymentHandler(); // Proceed with payment if the above conditions are met
  };

  const [showThankYouPopup, setShowThankYouPopup] = useState(false);

  const paymentHandler = async (e) => {
    if (e) e.preventDefault();

    try {
      // Wait for SDK to load and set in production mode
      const cashfree = await load({ mode: "production" }); //production
      if (!cashfree) {
        toast.error(
          "Failed to load Cashfree SDK. Please refresh and try again."
        );
        return;
      }

      // Calculate total amount
      const totalAmount = user.cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      const discountedAmount = totalAmount - (discount || 0);
const finalTotalAmount =
discountedAmount < 2000 ? discountedAmount + 50 : discountedAmount;

      // Retrieve access token
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Access token missing. Please log in and try again.");
        return;
      }

      // Generate unique order ID and create order on the server
      const orderId = `Order_${Date.now()}`;
      const serverResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            orderAmount: finalTotalAmount,
            orderCurrency: "INR",
            orderId,
          }),
        }
      );

      if (!serverResponse.ok) {
        toast.error("Failed to create order on the server.");
        return;
      }

      const { payment_session_id, order_id } = await serverResponse.json();

      // Start Cashfree checkout
      const result = await cashfree.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget: "_modal",
      });

      if (result.error) {
        toast.error("Payment interrupted. Please try again.");
        return;
      }

      if (result.paymentDetails) {
        // Prepare data for validation
        const products = user.cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        }));

        setShowThankYouPopup(true);
        setIsProcessing(false);

        // Validate payment
        const validateResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/payment/order/validate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              orderId: order_id,
              userToken: accessToken,
              products,
              giftMessage: giftMessage,
              address: selectedAddressId,
              amount: finalTotalAmount,
            }),
          }
        );

        const validationResult = await validateResponse.json();

        if (validationResult.status === "success") {
          //window.location.href = "/dashboard/buyer/my-purchases";
          toast.success("Payment successful! Order confirmed.");
        } else {
          toast.error("Payment verification failed. Please retry.");
        }
      }
    } catch (error) {
      setIsProcessing(false);
      toast.error("An error occurred during payment. Please try again.");
      console.error("Payment Error:", error);
    }
  };

  const deleteAddress = async (addressId) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/address/delete-address/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.status === 404) {
        toast.error("Address not found");
      } else if (response.status === 200) {
        toast.success("Address deleted successfully");
        // Update the local state to remove the deleted address from the UI
        setAddresses((prevAddresses) =>
          prevAddresses.filter((address) => address._id !== addressId)
        );
      } else {
        throw new Error(data.message || "Error deleting the address");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete the address");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader border-t-4 border-b-4 border-gray-800 rounded-full w-12 h-12 animate-spin"></div>
        <p className="select-none ml-4 text-gray-700">
          Loading your order review...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-5 mt-10">
      <div className="flex flex-col md:flex-row gap-x-8">
        {/* Scrollable Products List */}
        <div className="flex flex-col w-full md:w-3/5 h-auto overflow-y-auto mb-0 scrollbar-hide">
          <div className="flex flex-col gap-y-4">
            <div className="relative mb-10 border-2 border-gray-200 p-6 ">
              <h2 className="text-xl mb-7 flex justify-between items-center">
                Address Details
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={toggleDialog}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487a1.875 1.875 0 012.651 2.651l-9.193 9.193a4.5 4.5 0 01-2.122 1.19l-2.703.676a.75.75 0 01-.927-.927l.676-2.703a4.5 4.5 0 011.19-2.122l9.193-9.193z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 7.5l-3-3"
                    />
                  </svg>
                </button>
              </h2>

              <div className="">
                {addresses.length > 0 ? (
                  <>
                    {addresses
                      .slice(0, showAll ? addresses.length : 1)
                      .map((address, index) => (
                        <div
                          key={index}
                          className="flex flex-column gap-x-1 transition-all mb-3 border border-stone-400 p-2 rounded hover:border-black group relative"
                        >
                          <input
                            name="connected"
                            id={`address-${address._id}`}
                            type="radio"
                            className="mt-2 radio-black"
                            value={address._id}
                            onChange={(e) =>
                              setSelectedAddressId(e.target.value)
                            }
                            checked={selectedAddressId === address._id}
                          />
                          <div className="flex flex-col ml-3">
                            <h3 className="text-lg font-bold mb-1">
                              {address.name}
                            </h3>
                            <p className="select-none flex items-center text-gray-600">
                              <FontAwesomeIcon icon={faHome} className="mr-2" />
                              {address.house} {address.address}
                            </p>
                            <p className="select-none flex items-center text-gray-600">
                              <FontAwesomeIcon
                                icon={faMapPin}
                                className="mr-2"
                              />
                              {address.pincode}
                            </p>
                            <p className="select-none flex items-center text-gray-600">
                              <FontAwesomeIcon icon={faCity} className="mr-2" />
                              {address.city}, {address.state}
                            </p>
                            <p className="select-none flex items-center text-gray-600">
                              <FontAwesomeIcon
                                icon={faPhone}
                                className="mr-2"
                              />
                              {address.number}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="opacity-0 transition-opacity group-hover:opacity-100 absolute top-2 right-2 border p-1 rounded bg-red-100 text-red-900 border-red-900"
                            onClick={() => deleteAddress(address._id)}
                          >
                            <Trash />
                          </button>
                        </div>
                      ))}
                    {addresses.length > 1 && (
                      <button
                        onClick={toggleShowAll}
                        className="bg-black hover:bg-black/90 text-white py-2 px-4 rounded"
                      >
                        {showAll ? "Show Less" : "View All"}
                      </button>
                    )}
                  </>
                ) : (
                  <div
                    onClick={toggleDialog}
                    className="border-2 border-dashed border-gray-400 p-4 rounded text-center"
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="text-2xl text-gray-500 mb-2"
                    />
                    <h3 className="text-lg font-bold">Add an Address</h3>
                    <p className="select-none text-gray-600 mt-2">
                      Please add an address so that we can ship your order to
                      your selected location.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative mb-10 border-2 border-gray-200 p-6 ">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
              />
              <span className="text-gray-700">
                Is this a gift? (Write a gift message)
              </span>
            </label>
            {isGift && (
              <textarea
                className="mt-5 w-full border border-gray-300 rounded "
                maxLength={80}
                placeholder="Write a gift message for your loved ones here...   (upto 80 words) "
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
              />
            )}
          </div>

          <div className="flex flex-col gap-y-4">
            <div className="mb-10 border-2 border-gray-200 p-6">
              <h2 className="text-xl mb-7">Order Items</h2>
              {user?.cart
                ?.slice()
                .reverse()
                .map(({ product, quantity, color, size, _id }) => (
                  <div
                    key={product?._id}
                    className="flex flex-row gap-x-2 transition-all mb-3 border border-transparent p-2 rounded hover:border-black group relative"
                  >
                    <Image
                      src={product?.thumbnail?.url}
                      alt={product?.thumbnail?.public_id}
                      width={200}
                      height={200}
                      className="rounded h-[100px] w-[100px] object-cover"
                    />
                    <article className="flex flex-col gap-y-2">
                      <div className="flex flex-col gap-y-0.5">
                        <h1 className="text-lg">{product?.title}</h1>
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <p className="select-none flex justify-between items-baseline ">
                          <span className="text-[15px]">
                            ₹
                            <span className="text-[15px] text-black">
                              {product?.price}.00
                            </span>
                          </span>
                          <span className="whitespace-nowrap text-[12px] bg-indigo-300/50 text-indigo-500 border border-indigo-500 px-1.5 rounded ml-10">
                            QTY
                            <span className="text-sm text-black ml-1">
                              {quantity}
                            </span>
                          </span>
                        </p>
                        {color && (
                          <p className="select-none text-sm flex items-center gap-2">
                            <strong>Color:</strong>
                            <span
                              style={{
                                display: "inline-block",
                                width: "16px",
                                height: "16px",
                                backgroundColor: color,
                                border: "1px solid #000",
                                borderRadius: "50%",
                              }}
                            ></span>
                          </p>
                        )}
                        {size && (
                          <p className="select-none text-sm">
                            <strong>Size:</strong> {size || "N/A"}
                          </p>
                        )}
                      </div>
                    </article>
                  
                  </div>
                ))}

              {/* Static item card conditionally rendered */}
              {user?.cart?.reduce(
                (total, item) => total + item.product.price * item.quantity,
                0
              ) > 1000 && (
                <div className="flex flex-row gap-x-2 transition-all mb-3 border border-dashed p-2 rounded bg-gray-50">
                  <Image
                    src="https://res.cloudinary.com/dxaey2vvg/image/upload/v1734640812/lnn4hl4ijtrsfq4rtplm.jpg" // Replace with your static item image
                    alt="Static Item"
                    width={200}
                    height={200}
                    className="rounded h-[100px] w-[100px] object-cover"
                  />
                  <article className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-0.5">
                      <h1 className="text-lg">Charm freebie</h1>
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <p className="select-none text-sm">
                        <strong>Price:</strong> ₹0.00
                      </p>
                      <p className="select-none text-sm">
                        This is a complimentary item added in the cart for items
                        above ₹1,000.
                      </p>
                    </div>
                  </article>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Static Pricing Summary */}
        <div className="w-full md:w-2/5 ">
          <div className="bg-white p-6 shadow rounded-lg mb-5">
            <form className="w-full">
              <h2 className="text-lg mb-5">Coupons & Discounts</h2>
              <div className="flex flex-col w-full">
                <label htmlFor="name" className="text-sm ">
                  Coupon code
                </label>
                <input
                  type="text"
                  name="coupon"
                  id="coupon"
                  required
                  className="p-2 border rounded"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={applyCoupon}
                    className="flex-1 bg-black hover:bg-black/90 text-white py-2 px-4 rounded "
                  >
                    Apply Coupon
                  </button>
                </div>
                {feedback && (
                  <p className="mt-4 text-sm text-red-500">{feedback}</p>
                )}
              </div>
            </form>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg ">Order Summary</h2>
              <span className="text-sm font-medium bg-yellow-200 text-yellow-800 py-1 px-2 rounded-full">
                Free Shipping over ₹2000
              </span>
            </div>
            <div className="flex justify-between border-b pb-3 pt-3">
              <span>Subtotal</span>
              <span>{user?.cart?.length} items</span>
              <span
                className={isCouponApplied ? "line-through text-gray-500" : ""}
              >
                ₹{" "}
                {user?.cart
                  ?.reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
              {isCouponApplied && (
                <span className="text-green-500">
                  ₹{" "}
                  {(
                    user?.cart.reduce(
                      (total, item) =>
                        total + item.product.price * item.quantity,
                      0
                    ) - discount
                  ).toFixed(2)}
                </span>
              )}
            </div>
            {/* Calculate total to decide fee waiver */}
            {user && (
              <>
                <div
                  className={`flex justify-between border-b py-3 ${
                    user?.cart?.reduce(
                      (total, item) =>
                        total + item.product.price * item.quantity,
                      0
                    ) > 2000
                      ? "line-through"
                      : ""
                  }`}
                >
                  <span>Packaging Fee</span>
                  <span>
                    ₹{" "}
                    {user?.cart?.reduce(
                      (total, item) =>
                        total + item.product.price * item.quantity,
                      0
                    ) > 2000
                      ? "0.00"
                      : "10.00"}
                  </span>
                </div>
                <div
                  className={`flex justify-between border-b py-3 ${
                    user?.cart?.reduce(
                      (total, item) =>
                        total + item.product.price * item.quantity,
                      0
                    ) > 2000
                      ? "line-through"
                      : ""
                  }`}
                >
                  <span>Delivery Charges</span>
                  <span>
                    ₹{" "}
                    {user?.cart?.reduce(
                      (total, item) =>
                        total + item.product.price * item.quantity,
                      0
                    ) > 2000
                      ? "0.00"
                      : "40.00"}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between pt-3">
              <span>Total Amount</span>

              <span>
                ₹{" "}
                {(() => {
                  // Calculate cart total before discount
                  const cartTotal = user?.cart?.reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                  );

                  // Subtract discount
                  const discountedTotal = cartTotal - discount;

                  // Add packaging and delivery fees if discounted total is <= 2000
                  const finalAmount =
                    discountedTotal > 2000
                      ? discountedTotal
                      : discountedTotal + 50;

                  return finalAmount.toFixed(2);
                })()}
              </span>
            </div>
            <div className="text-sm mt-6">
              Review your order and if you have any query or facing any problem
              do contact us.
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={makePayment}
                className={`flex-1 bg-black hover:bg-black/90 text-white py-2 px-4 rounded ${
                  isProcessing ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Make Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <div>
            <a
              href="/cancellation"
              className="text-sm text-gray-600 hover:text-gray-900 mr-5"
            >
              Cancellation Policy
            </a>
            <a
              href="/terms"
              className="text-sm text-gray-600 hover:text-gray-900 mr-5"
            >
              Terms of use
            </a>
            <a
              href="/privacy"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Privacy
            </a>
          </div>
          <div className="mt-4 sm:mt-0">
            <a
              href="/contact-us"
              className="text-sm text-blue-600 hover:text-gray-900"
            >
              Need help? Contact Us
            </a>
          </div>
        </div>
      </div>

      {isDialogOpen && user && (
        <FormDialog
          onClose={toggleDialog}
          user={user}
          fetchAllAddresses={fetchAllAddresses}
        />
      )}

      {showThankYouPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full transform scale-100 transition-all duration-500 ease-in-out">
            {/* Lottie Animation */}
            <div className="mb-4">
              <div className="flex justify-center items-center">
                <Lottie
                  animationData={thanks}
                  style={{ width: "130px", height: "130px" }}
                />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Order Confirmed!
            </h2>
            <p className="select-none text-base text-gray-600 mb-6">
              Thank you for choosing us. We truly appreciate your support!
            </p>

            <div className="mt-4">
              <button
                onClick={() => {
                  setShowThankYouPopup(false);
                  window.location.href = "/dashboard/buyer/my-purchases";
                }}
                className="py-2 px-8 bg-black text-white text-base rounded-lg hover:bg-gray-800 transition ease-in-out duration-300"
              >
                Go to your orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FormDialog = ({ onClose, user, fetchAllAddresses }) => {
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const fetchPincodeDetails = async (pincode) => {
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      if (data[0].Status === "Success") {
        setState(data[0].PostOffice[0].State);
        setCity(data[0].PostOffice[0].Division);
      } else {
        console.error("Failed to fetch pincode details");
        setState("");
        setCity("");
      }
    } catch (error) {
      console.error("Error:", error);
      setState("");
      setCity("");
    }
  };

  const handlePincodeChange = (e) => {
    const pincode = e.target.value;
    if (pincode.length === 6) {
      fetchPincodeDetails(pincode);
    }
  };
  const handleAddAddress = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const addressData = {
      name: formData.get("name"),
      number: formData.get("number"),
      house: formData.get("house"),
      address: formData.get("address"),
      pincode: formData.get("pincode"),
      state: formData.get("state"),
      city: formData.get("city"),
    };

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/address/add-address`,
        addressData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((response) => {
        toast.success("Address added successfully!");
        fetchAllAddresses();
        onClose(); // Close the dialog
      })
      .catch((error) => {
        toast.error("Failed to add address: " + error.message);
      });
  };

 

  return (
    <div
      id="dialogContainer"
      onClick={onClose} // This attempts to close the dialog when the overlay is clicked
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating to the overlay
        className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full z-50 relative m-3"
      >
        <button
          onClick={onClose}
          className="mb-4 p-1 bg-black hover:bg-black/90 text-white rounded flex items-center justify-center"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <form
          className="w-full"
          onSubmit={handleAddAddress}
          id="handleAddAddress"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label htmlFor="name" className="text-sm ">
                Name*
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="p-2 border rounded"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="number" className="text-sm ">
                Number*
              </label>
              <input
                type="number"
                name="number"
                id="number"
                maxLength="10"
                required
                className="p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex flex-col w-full">
              <label htmlFor="address" className="text-sm ">
                Delivery Address*
              </label>
              <input
                type="text"
                name="address"
                id="address"
                required
                className="p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex flex-col w-full">
              <label htmlFor="house" className="text-sm ">
                House Number
              </label>
              <input
                type="text"
                name="house"
                id="house"
                maxLength="15"
                className="p-2 border rounded"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="pincode" className="text-sm ">
                Pincode*
              </label>
              <input
                type="number"
                name="pincode"
                id="pincode"
                maxLength="6"
                required
                onChange={handlePincodeChange}
                className="p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex flex-col w-full">
              <label htmlFor="state" className="text-sm">
                State*
              </label>
              <input
                type="text"
                name="state"
                id="state"
                required
                value={state}
                readOnly
                className="p-2 border rounded"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="city" className="text-sm ">
                City*
              </label>
              <input
                type="text"
                name="city"
                id="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
          </div>

          <br></br>

          <input
            type="submit"
            value="Add Address"
            className="mt-4 py-2 w-full border border-black rounded bg-black hover:bg-black/90 text-white transition-colors cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};

export default OrderReview;
