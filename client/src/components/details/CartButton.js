"use client";

import React, { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Bag from "../icons/Bag";
import Spinner from "../shared/Spinner";
import { useAddToCartMutation } from "@/services/cart/cartApi";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import View from "../icons/View";
import Women from "../icons/Women";
import Cart from "../icons/Cart";

const CartButton = ({ product, selectedColor, selectedSize }) => {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(0);
  const user = useSelector((state) => state?.auth?.user);

  const [
    addToCart,
    { isLoading: addingToCart, data: cartData, error: cartError },
  ] = useAddToCartMutation();

  useEffect(() => {
    if (addingToCart) {
      toast.loading("Adding to cart...", { id: "addToCart" });
    }

    if (cartData) {
      toast.success(cartData?.description, { id: "addToCart" });
      setQty(1);
    }
    if (cartError?.data) {
      toast.error(cartError?.data?.description, { id: "addToCart" });
    }
  }, [addingToCart, cartData, cartError]);

  const handleAddToCart = () => {
    // Check if color and size are selected
    if ((!selectedColor && product.variations.colors.length > 0) || 
        (!selectedSize && product.variations.sizes.length > 0)) {
      const missingFields = [
        !selectedColor && product.variations.colors.length > 0 ? "Color" : null,
        !selectedSize && product.variations.sizes.length > 0 ? "Size" : null,
      ]
        .filter(Boolean)
        .join(" and ");
      toast.error(`Please select ${missingFields} before adding to cart.`);
      return;
    }

    setAdded(1);
    addToCart({
      product: product._id,
      quantity: qty,
      color: selectedColor,
      size: selectedSize,
    });
  };

  return (
    <>
      <section className="flex flex-row items-center gap-x-4">
        <div className="flex flex-row gap-x-2 items-center border px-1 py-0.5 rounded-secondary h-full select-none">
          <button
            className="border border-black/30 disabled:border-zinc-100 p-1.5 rounded-secondary "
            onClick={() => setQty(qty - 1)}
            disabled={qty === 1}
          >
            <AiOutlineMinus className="w-4 h-4" />
          </button>

          <span className="px-2 py-0.5 rounded-primary border w-12 inline-block text-center">
            {qty}
          </span>
          <button
            className="border border-black/30 disabled:border-zinc-100 p-1.5 rounded-secondary"
            onClick={() => setQty(qty + 1)}
          >
            <AiOutlinePlus className="w-4 h-4" />
          </button>
        </div>
        <button
          className="px-8 py-2 border border-black rounded-secondary bg-black hover:bg-black/90 text-white transition-colors drop-shadow w-fit flex flex-row gap-x-2 items-center"
          disabled={qty === 0 || addingToCart}
          onClick={() => {
            if (user && Object.keys(user).length > 0) {
              // User is logged in, proceed to add to cart
              handleAddToCart();
            } else {
              // User is not logged in, redirect to the sign-in page
              window.open("auth/signin", "_self");
            }
          }}
        >
          {addingToCart ? (
            <Spinner />
          ) : (
            <>
              <Bag /> Add to Cart
            </>
          )}
        </button>
      </section>
      {added === 1 && (
        <a
          href="/order-review"
          className="px-8 py-2 border border-black rounded-secondary bg-black hover:bg-black/90 text-white transition-colors drop-shadow w-fit flex flex-row gap-x-2 items-center"
        >
          <Cart /> Buy Now
        </a>
      )}
    </>
  );
};

export default CartButton;
