import React, { useState, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import CartButton from "./CartButton";
import Description from "./Description";
import Policies from "./Policies";

const Right = ({ product }) => {
  // Extract reviews from the product object, default to an empty array if no reviews
  const reviews = product?.reviews || [];
  const [colorName, setColorName] = useState("");

  // Calculate the average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating =
    reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

  // Extract color and size options
  const colors = product?.variations?.colors || [];
  const sizes = product?.variations?.sizes || [];

  // State for selected color and size
  const [selectedColor, setSelectedColor] = useState(
    colors.length === 1
      ? colors[0].startsWith("#")
        ? colors[0]
        : `#${colors[0]}`
      : null
  );
  const [selectedSize, setSelectedSize] = useState(
    sizes.length === 1 ? sizes[0] : null
  );

  // Helper to check if selection is required
  const requiresSelection = colors.length > 1 || sizes.length > 1;

  useEffect(() => {
    if (selectedColor) {
      const hexWithoutHash = selectedColor.replace("#", "").toUpperCase();
      fetch(`https://www.thecolorapi.com/id?hex=${hexWithoutHash}`)
        .then((response) => response.json())
        .then((data) => {
          if (data?.name?.value) {
            setColorName(data.name.value);
          } else {
            setColorName("Unknown Color");
          }
        })
        .catch(() => setColorName("Error fetching color name"));
    } else {
      setColorName("");
    }
  }, [selectedColor]);

  return (
    <section className="lg:col-span-6 md:col-span-6 col-span-12 flex flex-col gap-y-8 select-none">
      <article className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-4">
          {/* Product title */}
          <h1 className="lg:text-5xl md:text-3xl text-xl select-none">
            {product?.title}
          </h1>

          {/* Product price and ratings */}
          <p className="select-none flex flex-row items-center gap-x-2">
            <span className="flex items-center border-2 border-grey rounded py-1 px-2 md:py-1.5 md:px-2.5 font-medium">
              {product?.priceExtra && (
                <span className="text-great !leading-none select-none line-through text-gray-500 text-sm">
                  ₹ {product?.priceExtra}
                </span>
              )}
              <br />
              <span className="text-black !leading-none select-none ml-2 text-lg">
                ₹ {product?.price}
              </span>
            </span>

            {/* Divider */}
            <div className="border-l h-7 rounded" />

            {/* Star rating display */}
            <span className="text-xs flex items-center gap-x-1 px-2 h-full bg-zinc-50 rounded">
              <AiFillStar className="w-4 h-4 text-yellow-500" />
              {averageRating} ({reviews.length})
            </span>
          </p>
        </div>

        {/* Color options */}
        {colors.length > 0 && (
          <div className="flex flex-col items-start">
            <div className="flex flex-row items-center gap-x-2">
              <strong className="select-none">Color:</strong>
              <div className="px-2">
                <span className="flex flex-row gap-x-2 scrollbar-hide text-sm">
                  {colors.map((color) => {
                    const validColor = color.startsWith("#")
                      ? color
                      : `#${color}`;
                    return (
                      <button
                        key={validColor}
                        style={{
                          backgroundColor: validColor,
                          height: "26px", // Slightly increased height
                          width: "26px", // Slightly increased width
                        }}
                        className={`rounded-full border ${
                          selectedColor === validColor
                            ? "border-black"
                            : "border-gray-300"
                        }`}
                        onClick={() => setSelectedColor(validColor)}
                        aria-label={`Select color ${validColor}`}
                      />
                    );
                  })}
                </span>
              </div>
            </div>
            {selectedColor && (
              <span className="text-sm text-gray-500 mt-3 select-none">
                Selected Color: {colorName || "Loading..."}
              </span>
            )}
          </div>
        )}

        {sizes.length > 0 && (
          <div className="flex flex-row items-center gap-x-2 select-none">
            <strong>Size:</strong>
            {sizes.map((size) => (
              <button
                key={size}
                className={`border px-2 select-none ${
                  selectedSize === size.toUpperCase()
                    ? "border-black bg-gray-200"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedSize(size.toUpperCase())}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* Cart button component */}
        <CartButton
          product={product}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
        />
      </article>

      {/* Description and policies */}
      <Description product={product} />
      <Policies />
    </section>
  );
};

export default Right;
