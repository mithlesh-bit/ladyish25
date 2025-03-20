"use client";
import { toast } from "react-hot-toast";
import Dashboard from "@/components/shared/layouts/Dashboard";
import React, { useState } from "react";

const Page = () => {
  const [formData, setFormData] = useState({
    codeName: "",
    discountPercentage: "",
    minimumCartValue: "",
    validity: "",
    category: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleAddCoupon = (e) => {
    e.preventDefault();

    const payload = {
      codeName: e.target.codeName.value.toUpperCase(),
      discountPercentage: e.target.discountPercentage.value,
      minimumCartValue: e.target.minimumCartValue.value,
      validity: e.target.validity.value,
      category: e.target.category.value,
    };

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/coupon/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        toast.success("Coupon added successfully!", { id: "addCoupon" });
      })
      .catch((error) => {
        toast.error(`Error adding coupon: ${error.message}`, {
          id: "addCoupon",
        });
        //console.error("Error:", error);
      });

    e.target.reset();
  };

  return (
    <Dashboard>
      <form className="w-full flex flex-col gap-y-4" onSubmit={handleAddCoupon}>
        {/* Coupon Code and Discount */}
        <div className="w-full flex flex-col gap-y-4 p-4 border rounded">
          <label htmlFor="codeName" className="w-full flex flex-col gap-y-1">
            <span className="text-sm">Coupon Code*</span>
            <input
              type="text"
              name="codeName"
              id="codeName"
              maxLength="100"
              required
            />
          </label>
          <label
            htmlFor="discountPercentage"
            className="w-full flex flex-col gap-y-1"
          >
            <span className="text-sm">Discount Percentage*</span>
            <input
              type="number"
              name="discountPercentage"
              id="discountPercentage"
              max="100"
              min="1"
              required
            />
          </label>
        </div>

        {/* Minimum Cart Value, Validity Date, and Category */}
        <div className="w-full flex flex-col gap-y-4 p-4 border rounded">
          <label
            htmlFor="minimumCartValue"
            className="w-full flex flex-col gap-y-1"
          >
            <span className="text-sm">Minimum Cart Value*</span>
            <input
              type="number"
              name="minimumCartValue"
              id="minimumCartValue"
              min="0"
              required
            />
          </label>
          <label htmlFor="validity" className="w-full flex flex-col gap-y-1">
            <span className="text-sm">Validity Date*</span>
            <input type="date" name="validity" id="validity" required />
          </label>
          <label htmlFor="category" className="w-full flex flex-col gap-y-1">
            <span className="text-sm">Category*</span>
            <input
              type="text"
              name="category"
              id="category"
              maxLength="100"
              required
            />
          </label>
        </div>

        {/* Submit Button */}
        <input
          type="submit"
          value="Add Coupon"
          className="py-2 border border-black rounded bg-black hover:bg-black/90 text-white transition-colors drop-shadow cursor-pointer"
        />
      </form>
    </Dashboard>
  );
};

export default Page;
