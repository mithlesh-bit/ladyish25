import React from "react";
import { useState } from "react";
import LoadImage from "../shared/LoadImage";
import Discount from "../icons/Discount";
import SoldOut from "../icons/SoldOut";
import Arrival from "../icons/Arrival";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import DetailCard from "./DetailCard";
import AddCustom from "./AddCustom";
import PredictSize from "./PredictSize";

const Left = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  // Function to determine the column span class
  function getColumnSpanClass(index, totalThumbnails) {
    if (totalThumbnails === 1) {
      return "col-span-12";
    } else if (totalThumbnails === 2) {
      return index <= 1 ? "col-span-6" : "col-span-6";
    } else if (totalThumbnails === 3) {
      return index === 0 ? "col-span-12" : "col-span-6";
    } else if (totalThumbnails === 4) {
      return "col-span-6";
    } else if (totalThumbnails === 5) {
      return index <= 1 ? "col-span-6" : "col-span-4";
    } else {
      return "";
    }
  }

  const hashTags = [
    ...(product?.category?.tags || []),
    ...(product?.brand?.tags || []),
    ...(product?.store?.tags || []),
  ].filter((tag) => tag !== undefined);

  return (
    <section className="lg:col-span-6 md:col-span-6 col-span-12 flex flex-col gap-y-4 select-none">
      <div className="flex flex-col gap-y-4">
        <div className="relative w-full h-full">
          {/* Product Thumbnail */}
          <LoadImage
            src={product.thumbnail?.url}
            alt={product.thumbnail?.public_id}
            width={480}
            height={200}
            className="rounded w-full h-full object-cover"
          />

          <img
            src="/handmade.png"
            alt="Handmade Icon"
            className="absolute bottom-3 right-3 object-contain w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
          />
        </div>

        <div className="grid grid-cols-12 gap-4">
          {product?.gallery?.map((thumbnail, index) => (
            <LoadImage
              src={thumbnail?.url}
              key={index}
              alt={thumbnail?.public_id}
              className={
                "rounded object-cover max-w-full w-full h-full" +
                " " +
                getColumnSpanClass(index, product.gallery.length)
              }
              width={480}
              height={200}
            />
          ))}
        </div>
      </div>
      {/* <article className="flex flex-col gap-y-4">
        <div className="flex flex-row gap-x-2.5">
          <Badge className="text-indigo-800 bg-indigo-100">
            {product?.variations?.colors?.length + " " + "Colors"}
          </Badge>
          <Badge className="px-2">
            <span className="flex flex-row gap-x-2 scrollbar-hide text-sm">
              {product?.variations?.colors?.map((color) => (
                <span
                  key={color}
                  style={{
                    backgroundColor: `#${color}`,
                    height: "20px",
                    width: "20px",
                  }}
                />
              ))}
            </span>
          </Badge>
        </div>

        <div className="flex flex-row gap-x-2.5">
          <Badge className="text-purple-800 bg-purple-100">
            {product?.variations?.sizes?.length + " " + "Sizes"}
          </Badge>
          <td className="px-2">
            <span className="flex flex-row gap-x-2 scrollbar-hide text-sm">
              {product?.variations?.sizes?.map((size) => (
                <span key={size} className="border px-1 py-0.5">
                  {size.toUpperCase()}
                </span>
              ))}
            </span>
          </td>
          {product?.campaign?.state === "discount" && (
            <Badge className="text-cyan-800 bg-cyan-100 flex flex-row items-center gap-x-1">
              <Discount /> {product?.campaign?.title}
            </Badge>
          )}
          {product?.campaign?.state === "sold-out" && (
            <Badge className="text-cyan-800 bg-cyan-100 flex flex-row items-center gap-x-1">
              <SoldOut /> {product?.campaign?.title}
            </Badge>
          )}
          {product?.campaign?.state === "arrival" && (
            <Badge className="text-cyan-800 bg-cyan-100 flex flex-row items-center gap-x-1">
              <Arrival /> {product?.campaign?.title}
            </Badge>
          )}
          {product?.campaign?.state === "on-sale" && (
            <Badge className="text-blue-800 bg-blue-100 flex flex-row items-center gap-x-1">
              <Arrival /> {product?.campaign?.title}
            </Badge>
          )}
        </div>
        <div className="flex flex-col gap-y-2.5">
          <DetailCard
            title={`From ${product?.category?.title} Category`}
            content={product?.category?.keynotes}
          />
          <DetailCard
            title={`From ${product?.brand?.title} Brand`}
            content={product?.brand?.keynotes}
          />
          <DetailCard
            title={`From ${product?.store?.title} Store`}
            content={product?.store?.keynotes}
          />

          <div className="flex flex-row flex-wrap gap-1 mt-4">
            {hashTags.map((hashTag, index) => (
              <span
                key={index}
                className="!text-xs border px-2 py-0.5 rounded-sm"
              >{`#${hashTag}`}</span>
            ))}
          </div>
        </div>
      </article> */}

      <article className="flex flex-col gap-y-4">
        {/* Campaign Section */}
        <div className="flex flex-row gap-x-2.5">
          {product?.campaign?.state === "discount" && (
            <Badge className="text-cyan-800 bg-cyan-100 flex flex-row items-center gap-x-1">
              <Discount /> {product?.campaign?.title}
            </Badge>
          )}
          {product?.campaign?.state === "sold-out" && (
            <Badge className="text-cyan-800 bg-cyan-100 flex flex-row items-center gap-x-1">
              <SoldOut /> {product?.campaign?.title}
            </Badge>
          )}
          {product?.campaign?.state === "arrival" && (
            <Badge className="text-cyan-800 bg-cyan-100 flex flex-row items-center gap-x-1">
              <Arrival /> {product?.campaign?.title}
            </Badge>
          )}
          {product?.campaign?.state === "on-sale" && (
            <Badge className="text-blue-800 bg-blue-100 flex flex-row items-center gap-x-1">
              <Arrival /> {product?.campaign?.title}
            </Badge>
          )}
        </div>
        {/* Details Section */}
        <div className="flex flex-col gap-y-2.5">
          <DetailCard
            title={`From ${product?.category?.title} Category`}
            content={product?.category?.keynotes}
          />
          <DetailCard
            title={`From ${product?.brand?.title} Brand`}
            content={product?.brand?.keynotes}
          />
          {/* <DetailCard
            title={`From ${product?.store?.title} Store`}
            content={product?.store?.keynotes}
          /> */}

          {/* HashTags Section */}
          <div className="flex flex-row flex-wrap gap-1 mt-4">
            {hashTags.map((hashTag, index) => (
              <span
                key={index}
                className="!text-xs border px-2 py-0.5 rounded-sm"
              >{`#${hashTag}`}</span>
            ))}
          </div>
        </div>
      </article>

      {/* <PredictSize /> */}
    </section>
  );
};

function Badge({ props, children, className }) {
  return (
    <span
      className={
        "px-3 py-1 rounded text-xs w-fit" + (className ? " " + className : "")
      }
      {...props}
    >
      {children}
    </span>
  );
}

export default Left;
