"use client";

import React, { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { MdFavorite } from "react-icons/md";
import Discount from "../icons/Discount";
import SoldOut from "../icons/SoldOut";
import Arrival from "../icons/Arrival";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useAddToFavoriteMutation,
  useRemoveFromFavoriteMutation,
} from "@/services/favorite/favoriteApi";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Spinner from "./Spinner";

const Card = ({ index, product, ...rest }) => {
  const router = useRouter();
  const user = useSelector((state) => state?.auth?.user);

  const reviews = product?.reviews || [];
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating =
    reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

  // check if product._id match with favorites array of object's product._id
  const favorite = user?.favorites?.find(
    (fav) => fav?.product?._id === product?._id
  );

  return (
    <div className="flex-shrink-0 flex flex-col gap-y-6 group border hover:border-black transition-colors rounded-lg">
      <div className="relative h-[200px] w-full rounded-lg">
        <Image
          onClick={() =>
            router.push(
              `/product?product_id=${
                product?._id
              }&product_title=${product?.title
                .replace(/ /g, "-")
                .toLowerCase()}}`
            )
          }
          {...rest}
          src={product?.thumbnail?.url}
          alt={product?.thumbnail?.public_id}
          width={296}
          height={200}
          className="h-[200px] w-full rounded-t-lg object-cover"
        />
        {/* <div className="flex flex-row gap-x-2.5 absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Logo
            src={product?.brand?.logo?.url}
            alt={product?.brand?.logo?.public_id}
          />
          <Logo
            src={product?.store?.thumbnail?.url}
            alt={product?.store?.thumbnail?.public_id}
          />
        </div> */}
        {product?.campaign && (
          <span className="text-xs bg-white/80 px-2.5 py-0.5 rounded-xl absolute bottom-4 right-4 cursor-not-allowed">
            {product?.campaign?.state === "discount" && (
              <span className="flex flex-row gap-x-0.5 items-center">
                <Discount /> {product?.campaign.title}
              </span>
            )}
            {product?.campaign?.state === "sold-out" && (
              <span className="flex flex-row gap-x-0.5 items-center">
                <SoldOut /> {product?.campaign.title}
              </span>
            )}
            {product?.campaign?.state === "new-arrival" && (
              <span className="flex flex-row gap-x-0.5 items-center">
                <Arrival /> {product?.campaign.title}
              </span>
            )}
            {product?.campaign?.state === "on-sale" && (
              <span className="flex flex-row gap-x-0.5 items-center">
                <Arrival /> {product?.campaign.title}
              </span>
            )}
          </span>
        )}
        {favorite ? (
          <RemoveFromFavorite favorite={favorite} />
        ) : (
          <AddToFavorite product={product} />
        )}
      </div>
      <article className="flex flex-col gap-y-3.5 px-4 h-full">
        <div className="flex flex-row items-center gap-x-1.5">
          {product?.variations?.colors?.length !== 0 ||
          product?.variations?.sizes?.length !== 0 ? (
            <>
              {product?.variations?.colors?.length !== 0 && (
                <Badge className="text-indigo-800 bg-indigo-100">
                  {product?.variations?.colors?.length + " Colors"}
                </Badge>
              )}

              {product?.variations?.sizes?.length !== 0 && (
                <>
                  {product?.variations?.colors?.length !== 0 && (
                    <div className="h-5 border-l w-[1px]"></div>
                  )}
                  <Badge className="text-purple-800 bg-purple-100">
                    {product?.variations?.sizes?.length + " Sizes"}
                  </Badge>
                </>
              )}
            </>
          ) : (
            <div className="text-gray-500">
              <Badge className="text-indigo-800 bg-indigo-100">
                No Colors Available
              </Badge>
            </div>
          )}
        </div>

        <div
          className="flex flex-col gap-y-4 cursor-pointer h-full"
          onClick={() =>
            router.push(
              `/product?product_id=${
                product?._id
              }&product_title=${product?.title
                .replace(/ /g, "-")
                .toLowerCase()}}`
            )
          }
        >
          <h2 className="line-clamp-2 h-full">{product?.title}</h2>
          <div className="flex flex-row items-end justify-between mt-auto">
            <span className="flex items-center border-2 border-grey rounded py-1 px-1 md:py-1.5 md:px-2.5 font-medium">
              {product?.priceExtra && (
                <span className="text-great !leading-none select-none line-through text-gray-500 text-sm">
                  ₹ {product?.priceExtra}
                  <br />
                </span>
              )}

              <span className="text-black !leading-none select-none ml-2 text-sm">
                ₹ {product?.price}
              </span>
            </span>
            <span className="text-xs flex items-center gap-x-1 px-2 h-full bg-zinc-50 rounded">
              <AiFillStar className="w-4 h-4 text-yellow-500" />
              {averageRating} ({reviews.length})
            </span>
          </div>
        </div>
      </article>
      <div></div>
    </div>
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

function Logo({ src, alt, props, className }) {
  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      width={30}
      height={30}
      className={
        "w-[30px] h-[30px] object-cover rounded-[5px] shadow border border-transparent hover:border-black transition-colors cursor-help" +
        (className ? " " + className : "")
      }
    />
  );
}

function AddToFavorite({ product }) {
  const user = useSelector((state) => state?.auth?.user);
  const [addToFavorite, { isLoading, data, error }] =
    useAddToFavoriteMutation();

  useEffect(() => {
    if (isLoading) {
      toast.loading("Adding to favorite...", { id: "addToFavorite" });
    }

    if (data) {
      toast.success(data?.description, { id: "addToFavorite" });
    }

    if (error?.data) {
      toast.error(error?.data?.description, { id: "addToFavorite" });
    }
  }, [isLoading, data, error]);

  return (
    <button
      className="border border-transparent bg-white hover:border-black shadow p-1 absolute bottom-4 left-4 rounded-secondary opacity-0 group-hover:opacity-100 transition-all"
      onClick={() => addToFavorite({ product: product?._id })}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <MdFavorite className={`w-5 h-5 text-black`} />
      )}
    </button>
  );
}

function RemoveFromFavorite({ favorite }) {
  const user = useSelector((state) => state?.auth?.user);
  const [removeFromFavorite, { isLoading, data, error }] =
    useRemoveFromFavoriteMutation();

  useEffect(() => {
    if (isLoading) {
      toast.loading("Adding to favorite...", { id: "addToFavorite" });
    }

    if (data) {
      toast.success(data?.description, { id: "addToFavorite" });
    }

    if (error?.data) {
      toast.error(error?.data?.description, { id: "addToFavorite" });
    }
  }, [isLoading, data, error]);

  return (
    <button
      className="border border-transparent bg-white hover:border-black shadow p-1 absolute bottom-4 left-4 rounded-secondary opacity-0 group-hover:opacity-100 transition-all"
      onClick={() => removeFromFavorite({ id: favorite?._id })}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <MdFavorite className={`w-5 h-5 text-red-500`} />
      )}
    </button>
  );
}

export default Card;
