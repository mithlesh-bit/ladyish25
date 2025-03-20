"use client";

import Inform from "@/components/icons/Inform";
import Dashboard from "@/components/shared/layouts/Dashboard";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  faLocationDot,
  faPhone,
  faCalendar,
  faAngleDown,
  faHashtag,
  faAngleUp,
  faHeadset,
  faCheck,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Page = () => {
  const user = useSelector((state) => state.auth.user);
  const [addressDetails, setAddressDetails] = useState({});
  const [loading, setLoading] = useState(true); // Add a loading state
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const targetOrderId = "order_OhKGtComRw8Irt";

  // Fetch address details
  const fetchAddressDetails = async (addressId) => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/address/adress-details/${addressId}`
      );

      return data; // Assuming data contains the address details
    } catch (error) {
      //.error("Error fetching address details:", error);
      return null;
    }
  };

  useEffect(() => {
    // Log user.purchases to ensure it's populated correctly

    if (user && user.purchases) {
      const fetchAllAddresses = async () => {
        const allAddresses = {};
        for (const purchase of user.purchases) {
          const addressDetail = await fetchAddressDetails(purchase.address);
          if (addressDetail) {
            allAddresses[purchase.address] = addressDetail;
          }
        }
        setAddressDetails(allAddresses);
        setLoading(false); // Set loading to false after addresses are fetched
      };

      fetchAllAddresses();
    } else {
      setLoading(false); // If no purchases, stop loading
    }
  }, [user]);

  // Check if purchases are still loading
  if (loading) {
    return (
      <Dashboard>
        <p className="select-none text-center text-sm py-4">
          Loading purchases...
        </p>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      {user && user.purchases ? (
        user.purchases.length > 0 ? (
          <section className="w-full p-4">
            {[...user.purchases].reverse().map((purchase) => (
              <div
                key={purchase._id}
                className="bg-white rounded-lg shadow-lg mb-7 overflow-hidden border border-black"
              >
                <div
                  className="w-full py-3 text-white flex justify-between items-center"
                  style={{ backgroundColor: "#F9FAFB" }}
                >
                  <div className="flex items-center w-full">
                    {/* Order Status Progress Bar */}
                    <div className="w-full px-4">
                      {" "}
                      {/* Add padding to prevent icons from being cut */}
                      <div className="relative pt-1">
                        {/* Stages above the progress bar */}
                        <div className="flex justify-between mb-4">
                          <span className="text-sm text-center w-1/4 text-black">
                            Ordered
                          </span>

                          <span className="text-sm text-black text-center w-1/4">
                            Progress
                          </span>
                          <span className="text-sm text-black text-center w-1/4">
                            Dispatched
                          </span>
                          <span className="text-sm text-black text-center w-1/4">
                            Delivered
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="flex relative items-center">
                          {[
                            "Ordered",
                            "In Progress",
                            "Dispatched",
                            "Delivered",
                          ].map((stage, index) => {
                            const isActive = purchase.status === stage;
                            const isCompleted =
                              index <=
                              [
                                "Ordered",
                                "In Progress",
                                "Dispatched",
                                "Delivered",
                              ].indexOf(purchase.status);
                            return (
                              <div key={index} className="flex-grow relative">
                                {/* Progress Bar Section */}
                                <div
                                  className={`h-2 ${
                                    isCompleted ? "bg-green-500" : "bg-gray-300"
                                  } rounded-full`}
                                />
                                {/* Circle Icon */}
                                <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2">
                                  <div
                                    className={`h-4 w-4 rounded-full ${
                                      isCompleted
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    } flex items-center justify-center`}
                                  >
                                    {isCompleted && (
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        className="text-white text-xs"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div
                    className={`overflow-hidden transition-all ${
                      expanded ? "max-h-screen" : "max-h-[8rem]"
                    }`}
                  >
                    {purchase.products.map((productInfo, index) => (
                      <Link
                        key={index}
                        href={`/product?product_id=${productInfo.product?._id}&product_title=${productInfo.product?.title}`}
                        className="border-t border-gray-200 last:border-b flex items-center p-4 hover:bg-gray-50 transition-colors"
                        target="_blank"
                      >
                        <img
                          src={
                            productInfo.product?.gallery?.[0]?.url ||
                            "https://via.placeholder.com/80"
                          }
                          alt={productInfo.product?.title}
                          className="h-24 w-24 flex-shrink-0 object-cover rounded-md mr-4"
                        />
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-900">
                            {productInfo.product?.title}
                          </h4>
                          <p className="select-none text-sm text-gray-600">
                            Quantity: {productInfo.quantity}
                          </p>

                           {productInfo?.color && (
                            <p className="text-sm flex items-center gap-2">
                              <strong>Color:</strong>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "16px",
                                  height: "16px",
                                  backgroundColor: productInfo.color,
                                  border: "1px solid #000",
                                  borderRadius: "50%",
                                }}
                              ></span>
                            </p>
                          )}

                          {productInfo?.size && (
                            <p className="text-sm text-gray-600">
                              Size: {productInfo.size}
                            </p>
                          )}
                          <p className="text-sm font-semibold">
                            Price: ₹
                            {productInfo.product.price * productInfo.quantity}
                          </p>                       
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Show More/Less Button */}
                  {purchase.products.length > 1 && (
                    <div className="flex justify-center">
                      <button
                        onClick={handleToggle}
                        className="text-sm text-white bg-black px-5 rounded transition hover:bg-gray-800"
                      >
                        {expanded ? (
                          <FontAwesomeIcon icon={faAngleUp} />
                        ) : (
                          <FontAwesomeIcon icon={faAngleDown} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
                <div
                  className="w-full py-3 text-white flex flex-col lg:flex-row justify-between items-start lg:items-center"
                  style={{ backgroundColor: "#F9FAFB" }}
                >
                  {/* Address Details */}

                  <div className="px-4 py-2 text-white w-full lg:w-auto">
                    <p className="select-none text-gray-600 text-sm">
                      <FontAwesomeIcon icon={faHashtag} className="mr-2" />
                      <span className="text-black">
                        <strong>Order Id : </strong>
                        {purchase.orderId}
                      </span>
                    </p>
                    <strong className="text-black">Address Details :</strong>

                    <p className="select-none text-gray-600 text-sm">
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      {addressDetails[purchase.address] ? (
                        <span>{addressDetails[purchase.address].name}</span>
                      ) : (
                        <span>Loading Name</span>
                      )}
                    </p>
                    <p className="select-none text-gray-600 text-sm">
                      <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                      {addressDetails[purchase.address] ? (
                        <>
                          <span>
                            {addressDetails[purchase.address].address},{" "}
                          </span>
                          <span>{addressDetails[purchase.address].city}, </span>
                          <span>{addressDetails[purchase.address].state} </span>
                          <span>
                            {addressDetails[purchase.address].pincode}{" "}
                          </span>
                        </>
                      ) : (
                        <span>Loading address...</span>
                      )}
                    </p>

                    <p className="select-none text-gray-600 text-sm">
                      <FontAwesomeIcon icon={faPhone} className="mr-2" />
                      {addressDetails[purchase.address] ? (
                        <span>{addressDetails[purchase.address].number}</span>
                      ) : (
                        <span>Loading Phone number...</span>
                      )}
                    </p>
                  </div>

                  {/* Date Section */}
                  <div className="px-4 text-white w-full lg:w-auto lg:text-right ">
                    <p className="select-none text-gray-600 text-sm">
                      <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                      <span className=" rounded-lg text-sm text-black">
                        {purchase.createdAt.substring(8, 10) +
                          "/" +
                          purchase.createdAt.substring(5, 7) +
                          "/" +
                          purchase.createdAt.substring(0, 4)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <p className="select-none text-center text-sm py-4">
            No Purchases Found
          </p>
        )
      ) : (
        <p className="select-none text-center text-sm py-4">Loading Purchase</p>
      )}
    </Dashboard>
  );
};

export default Page;
