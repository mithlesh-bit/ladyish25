"use client";

import React, { useEffect, useState } from "react";
import Dashboard from "@/components/shared/layouts/Dashboard";
import Spinner from "@/components/shared/Spinner";
import { toast } from "react-hot-toast";

const OrderDetailsPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const limit = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Retrieve the access token from localStorage (or any other secure storage)
      const accessToken = localStorage.getItem("accessToken");
  
      if (!accessToken) {
        toast.error("User is not authorized. Please log in again.");
        return;
      }
  
      // Make the fetch request with the Authorization header
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/purchase/orders10?page=${currentPage}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        console.log(11,response);
        toast.error(` ${response.statusText}`);
      }
  
      const json = await response.json();
      const { data, totalPages } = json;
      setOrders(data);
      setTotalPages(totalPages);
    } catch (error) {
      // Handle error scenarios
      toast.error("Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchOrderDetails = async (orderId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/purchase/order/${orderId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      if (json.success) {
        if (typeof json.data.address === "string") {
          try {
            json.data.address = sanitizeAddressString(json.data.address);
            json.data.address = JSON.parse(json.data.address);
          } catch (error) {
            //console.error("Failed to parse address:", error);
            toast.error("Invalid address format.");
          }
        }

        setSelectedOrder(json.data);
      } else {
        toast.error("Failed to load order details.");
      }
    } catch (error) {
      //console.error("Failed to fetch order details:", error.message);
      toast.error("Failed to load order details.");
    } finally {
      setIsLoading(false);
    }
  };

  const sanitizeAddressString = (addressString) => {
    addressString = addressString.replace(/'/g, '"');
    addressString = addressString.replace(
      /new ObjectId\('([a-f0-9]{24})'\)/g,
      '"$1"'
    );
    return addressString;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/purchase/update-purchase-status/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      if (json.acknowledgement) {
        toast.success("Order status updated successfully!");

        // Update `orders` state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );

        // Update `selectedOrder` if it matches
        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prevSelectedOrder) => ({
            ...prevSelectedOrder,
            status: newStatus,
          }));
        }
      } else {
        toast.error(json.message || "Failed to update status.");
      }
    } catch (error) {
      // console.error("Failed to update order status:", error.message);
      toast.error("Failed to update order status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Filter orders based on selected status
  const filteredOrders = orders?.filter((order) => {
    if (filterStatus === "All") return true;
    return order.status === filterStatus;
  });

  const isToday = (createdAt) => {
    const today = new Date();
    const todayFormatted = `${String(today.getDate()).padStart(
      2,
      "0"
    )}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    const createdDate = new Date(createdAt);
    const createdDateFormatted = `${String(createdDate.getDate()).padStart(
      2,
      "0"
    )}/${String(createdDate.getMonth() + 1).padStart(
      2,
      "0"
    )}/${createdDate.getFullYear()}`;

    return todayFormatted === createdDateFormatted;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB"); // Formats as DD/MM/YYYY
  };

  return (
    <Dashboard>
      <div className="mx-5 container px-5 py-5 overflow-x-hidden">
        <h1 className="text-2xl font-bold text-center mb-6">Order Details</h1>
  
        {isLoading && (
          <div className="flex justify-center items-center h-screen">
            <Spinner />
          </div>
        )}
  
        {!isLoading && orders?.length > 0 && (
          <select
            className="mb-4 p-4 border rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Ordered">Ordered</option>
            <option value="In Progress">In Progress</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
          </select>
        )}
  
        {!isLoading && !selectedOrder && filteredOrders?.length > 0 && (
          <div className="grid gap-y-4 gap-x-8">
            {filteredOrders.map((order) => (
              <div
                key={order?._id || Math.random()} // Fallback to a random key if _id is undefined
                className="mb-8 p-4 border rounded-lg shadow-lg"
              >
                <h2 className="text-lg font-semibold">
                  Order ID: {order?.orderId || "N/A"}
                </h2>
                <div>Name: {order?.customer?.name || "N/A"}</div>
                <div>Number: {order?.customer?.phone || "N/A"}</div>
                <div>Email: {order?.customer?.email || "N/A"}</div>
                <div>Status: {order?.status || "N/A"}</div>
  
                <div
                  className={`${
                    isToday(order?.createdAt) ? "bg-green-500 text-white" : ""
                  }`}
                >
                  <strong>Order Date:</strong> {formatDate(order?.createdAt)}
                  {isToday(order?.createdAt) && (
                    <span className="ml-2 font-semibold">New Order!</span>
                  )}
                </div>
                <button
                  onClick={() => fetchOrderDetails(order?._id)}
                  className="mt-4 px-4 py-2 bg-black text-white rounded"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
  
        {selectedOrder && (
          <div className="p-6 border rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">
              Order ID: {selectedOrder?.orderId || "N/A"}
            </h2>
            <div className="font-medium">
              <strong>Customer:</strong>{" "}
              {selectedOrder?.customer?.name || "N/A"} (
              {selectedOrder?.customer?.email + " , " || "N/A"}
              {selectedOrder?.customer?.phone || "N/A"})
            </div>
  
            <div>
              <strong>Address:</strong>
              {selectedOrder?.address ? (
                <div>
                  <p>
                    <strong>Name :</strong>{" "}
                    {selectedOrder.address.name || "N/A"}
                  </p>
                  <p>
                    <strong>Phone Number :</strong>{" "}
                    {selectedOrder.address.number || "N/A"}
                  </p>
                  <p>
                    <strong>House No. :</strong>{" "}
                    {selectedOrder.address.house || "N/A"}
                  </p>
                  <p>
                    <strong>Address : </strong>{" "}
                    {selectedOrder.address.address || "N/A"}
                  </p>
                  <p>
                    <strong>City : </strong>{" "}
                    {selectedOrder.address.city || "N/A"}
                  </p>
                  <p>
                    <strong>State :</strong>{" "}
                    {selectedOrder.address.state || "N/A"}
                  </p>
                  <p>
                    <strong>Pincode :</strong>{" "}
                    {selectedOrder.address.pincode || "N/A"}
                  </p>
                </div>
              ) : (
                <p>Address details not available.</p>
              )}
            </div>
  
            <div>
              <strong className="mr-3">Status :</strong>
              <select
                value={selectedOrder?.status || ""}
                onChange={(e) =>
                  updateOrderStatus(selectedOrder?._id, e.target.value)
                }
                className="border p-2 m-1 rounded"
              >
                <option value="Ordered">Ordered</option>
                <option value="In Progress">In Progress</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
                {/* <option value="Completed">Completed</option> */}
              </select>
            </div>
  
            <div className="bg-green-500 ">
              <strong>Total Amount :</strong> ₹{" "}
              {selectedOrder?.totalAmount || "N/A"}
            </div>
            <div>
              <strong>Order Date :</strong>{" "}
              {formatDate(selectedOrder?.createdAt)}
            </div>
  
            <div>
              <strong>Message :</strong>{" "}
              {selectedOrder?.giftMessage ??
                "Thank you for shopping with Ladyish"}
            </div>
            <div>
              <strong>Products :</strong>
              <ul className="space-y-4">
                {selectedOrder?.products?.map(
                  ({ product, quantity, color, size }) => (
                    <li
                      key={product?._id || Math.random()} // Fallback key
                      className="flex items-center space-x-4 border p-2 rounded-md"
                    >
                      <a
                        href={`https://www.ladyish.in/product?product_id=${
                          product?._id || ""
                        }&product_title=${product?.title || "N/A"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-4"
                      >
                        <img
                          src={product?.thumbnail?.url || ""}
                          alt={product?.title || "N/A"}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </a>
                      <div>
                        <p className="select-none font-medium">
                          {product?.title || "N/A"}
                        </p>
                        <p>Quantity: {quantity || "N/A"}</p>
                        <p className="select-none text-sm flex items-center gap-2">
                          <strong>Color:</strong>
                          {color ? (
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
                          ) : (
                            "N/A"
                          )}
                        </p>
                        <p>Size: {size || "N/A"}</p>
                        <p>Price: ₹{product?.price || "N/A"}</p>
                      </div>
                    </li>
                  )
                )}
              </ul>
            </div>
  
            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 px-4 py-2 bg-black text-white rounded"
            >
              Back to Orders
            </button>
          </div>
        )}
  
        {!isLoading && orders?.length > 0 && !selectedOrder && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
  
        {!isLoading && !orders?.length && (
          <p className="select-none text-center mt-6">No orders found!</p>
        )}
      </div>
    </Dashboard>
  );
  
};

export default OrderDetailsPage;
