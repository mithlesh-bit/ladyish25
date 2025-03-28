"use client";

import DetailCard from "@/components/details/DetailCard";
import Inform from "@/components/icons/Inform";
import Pencil from "@/components/icons/Pencil";
import Trash from "@/components/icons/Trash";
import User from "@/components/icons/User";
import Modal from "@/components/shared/Modal";
import Dashboard from "@/components/shared/layouts/Dashboard";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/services/product/productApi";
import { useRemoveReviewMutation } from "@/services/review/reviewApi";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Page = () => {
  const {
    isLoading: fetchingProducts,
    data: fetchProductsData,
    error: fetchProductsError,
  } = useGetProductsQuery();
  const products = useMemo(
    () => fetchProductsData?.data || [],
    [fetchProductsData]
  );
  const user = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    if (fetchProductsError) {
      toast.error(fetchProductsError?.data?.description, {
        id: "fetchProducts",
      });
    }

    if (fetchingProducts) {
      toast.loading("Fetching Products...", { id: "fetchProducts" });
    }

    if (fetchProductsData) {
      toast.success(fetchProductsData?.description, {
        id: "fetchProducts",
      });
    }
  }, [fetchProductsError, fetchingProducts, fetchProductsData]);

  return (
    <Dashboard>
      {products?.length === 0 ? (
        <p className="select-none text-sm flex flex-row gap-x-1 items-center justify-center">
          <Inform /> No Products Added!
        </p>
      ) : (
        <section className="w-full h-full">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-slate-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Thumbnail
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Price (₹)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Gallery
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Sizes
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Colors
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Brand
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Store
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase whitespace-nowrap"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product?._id}
                    className="odd:bg-white even:bg-gray-100 hover:odd:bg-gray-100"
                  >
                    <td className="px-6 py-4">
                      <Image
                        src={product?.thumbnail?.url}
                        alt={product?.thumbnail?.public_id}
                        height={30}
                        width={30}
                        className="h-[30px] w-[30px] rounded-secondary border border-green-500/50 object-cover"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap w-60 overflow-x-auto block scrollbar-hide text-sm">
                        {product?.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap scrollbar-hide text-sm">
                        {product?.price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-4">
                        {product?.gallery.map((thumbnail) => (
                          <Image
                            key={thumbnail?._id}
                            src={thumbnail?.url}
                            alt={thumbnail?.public_id}
                            height={30}
                            width={30}
                            className="h-[30px] w-[30px] rounded-secondary border border-green-500/50 object-cover"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex flex-row gap-x-2 scrollbar-hide text-sm">
                        {product?.variations?.sizes?.map((size) => (
                          <span key={size} className="border px-1 py-0.5">
                            {size.toUpperCase()}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap scrollbar-hide text-sm">
                        {product?.category?.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap scrollbar-hide text-sm">
                        {product?.brand?.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap scrollbar-hide text-sm">
                        {product?.store?.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex flex-row gap-x-2 justify-end">
                        <ViewProduct product={product} />
                        {user?.store?._id === product?.store?._id && (
                          <DeleteProduct product={product} />
                        )}
                        {user?.store?._id === product?.store?._id && (
                          <Link
                            href={`/dashboard/seller/update-product?id=${product?._id}`}
                            className="bg-green-50 border border-green-900 p-0.5 rounded-secondary text-green-900"
                          >
                            <Pencil />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </Dashboard>
  );
};

function ViewProduct({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("buyers");

  return (
    <>
      <button
        type="submit"
        className="bg-purple-50 border border-purple-900 p-0.5 rounded-secondary text-purple-900"
        onClick={() => setIsOpen(true)}
      >
        <User />
      </button>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="lg:w-1/3 md:w-3/4 w-full h-96 md:mx-0 mx-4 z-50 bg-white p-6 drop-shadow-2xl"
        >
          <section className="flex flex-col gap-y-6 h-full">
            <div className="flex flex-row gap-x-2 justify-start">
              <button
                className={`bg-purple-50 border border-purple-900 text-sm py-1 rounded-secondary text-purple-900 px-4 ${
                  tab === "buyers" ? "bg-purple-900 !text-white" : ""
                }`}
                onClick={() => setTab("buyers")}
              >
                Buyers
              </button>
              <button
                className={`bg-orange-50 border border-orange-900 text-sm py-1 rounded-secondary text-orange-900 px-4 ${
                  tab === "reviews" ? "bg-orange-900 !text-white" : ""
                }`}
                onClick={() => setTab("reviews")}
              >
                Reviews
              </button>
            </div>

            {tab === "buyers" && <ProductBuyers product={product} />}
            {tab === "reviews" && <ProductReviews product={product} />}
          </section>
        </Modal>
      )}
    </>
  );
}

function ProductBuyers({ product }) {
  return (
    <>
      {product?.buyers?.length > 0 ? (
        <div className="h-full overflow-y-auto scrollbar-hide text-left">
          <div className="grid grid-cols-2 gap-4">
            {product?.buyers?.map((buyer) => (
              <div
                key={buyer?._id}
                className="flex flex-col gap-y-4 border rounded p-4"
              >
                <div className="flex flex-row gap-x-2">
                  <Image
                    src={buyer?.avatar?.url}
                    alt={buyer?.avatar?.public_id}
                    width={40}
                    height={40}
                    className="h-[40px] w-[40px] object-cover rounded-secondary"
                  />
                  <div className="flex flex-col gap-y-0.5">
                    <h1 className="text-lg">{buyer?.name}</h1>
                    <p className="select-none text-sm">{buyer?.email}</p>
                    <p className="select-none text-xs">{buyer?.phone}</p>
                  </div>
                </div>

                <p className="select-none flex flex-row flex-wrap gap-2">
                  <span className="text-xs border rounded px-1 py-0.5">
                    Cart {buyer?.cart?.length}
                  </span>
                  <span className="text-xs border rounded px-1 py-0.5">
                    Favorites {buyer?.favorites?.length}
                  </span>
                  <span className="text-xs border rounded px-1 py-0.5">
                    Purchases {buyer?.purchases?.length}
                  </span>
                  <span className="text-xs border rounded px-1 py-0.5">
                    Reviews Given {buyer?.reviews?.length}
                  </span>
                  <span className="text-xs border rounded px-1 py-0.5">
                    Products Buy {buyer?.products?.length}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="select-none text-left">No-one buy this yet!</p>
      )}
    </>
  );
}

function ProductReviews({ product }) {
  const [removeReview, { isLoading, error, data }] = useRemoveReviewMutation();

  useEffect(() => {
    if (isLoading) {
      toast.loading("Deleting Review...", { id: "deleteReview" });
    }

    if (data) {
      toast.success(data?.description, { id: "deleteReview" });
    }

    if (error?.data) {
      toast.error(error?.data?.description, { id: "deleteReview" });
    }
  }, [isLoading, data, error]);

  return (
    <>
      {product?.reviews?.length > 0 ? (
        <div className="h-full overflow-y-auto scrollbar-hide text-left flex flex-col gap-y-4">
          {product?.reviews?.map((review, index) => (
            <article
              key={index}
              className="flex flex-col gap-y-2 p-4 bg-slate-50 rounded relative group"
            >
              <div className="flex flex-row gap-x-2">
                <Image
                  src={review?.reviewer?.avatar?.url}
                  alt={review?.reviewer?.avatar?.public_id}
                  width={40}
                  height={40}
                  className="rounded object-cover h-[40px] w-[40px]"
                />
                <div className="flex flex-col gap-y-1">
                  <h2 className="text-base">{review?.reviewer?.name}</h2>
                  <p className="select-none text-xs whitespace-normal">
                    {review?.reviewer?.email}
                  </p>
                  <p className="select-none text-xs">
                    {new Date(review?.createdAt).toLocaleDateString("en-GB")} •
                    ⭐ {review?.rating}
                  </p>
                </div>
              </div>
              <p className="select-none text-sm whitespace-normal">
                {review?.comment}
              </p>

              <button
                type="button"
                className="absolute top-2 right-2 bg-red-50 border border-red-900 p-1 rounded-secondary text-red-900 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeReview(review?._id)}
              >
                <Trash />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <p className="select-none text-left">No reviews found yet!</p>
      )}
    </>
  );
}

function DeleteProduct({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteProduct, { isLoading, data, error }] =
    useDeleteProductMutation();

  useEffect(() => {
    if (isLoading) {
      toast.loading("Deleting Product...", { id: "deleteProduct" });
    }

    if (data) {
      toast.success(data?.description, { id: "deleteProduct" });
      setIsOpen(false);
    }

    if (error?.data) {
      toast.error(error?.data?.description, { id: "deleteProduct" });
    }
  }, [isLoading, data, error]);

  return (
    <>
      <button
        type="submit"
        className="bg-red-50 border border-red-900 p-0.5 rounded-secondary text-red-900"
        onClick={() => setIsOpen(true)}
      >
        <Trash />
      </button>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="p-4 lg:w-1/5"
        >
          <article className="flex flex-col gap-y-4">
            <p className="select-none text-xs bg-yellow-500/50 text-black px-2 py-0.5 rounded-sm text-center">
              Product will be deleted permanently!
            </p>
            <div className="flex flex-col items-start gap-y-2">
              <h1 className="text-xl">Are you sure?</h1>
              <p className="select-none text-sm flex flex-col gap-y-2">
                You are about to unlisted from:
                <p className="select-none flex flex-col gap-y-1.5">
                  <span className="flex flex-row gap-x-1 items-center text-xs">
                    <Inform /> Brand: {product?.brand?.title}
                  </span>
                  <span className="flex flex-row gap-x-1 items-center text-xs">
                    <Inform /> Category: {product?.category?.title}
                  </span>
                  <span className="flex flex-row gap-x-1 items-center text-xs">
                    <Inform /> Store: {product?.store?.title}
                  </span>
                  <span className="flex flex-row gap-x-1 items-center text-xs">
                    <Inform /> Lost {product?.buyers?.length} buyers
                  </span>
                  <span className="flex flex-row gap-x-1 items-center text-xs">
                    <Inform /> Lost {product?.reviews?.length} reviews
                  </span>
                </p>
              </p>
            </div>
            <div className="flex flex-row gap-x-4">
              <button
                className="text-white bg-slate-500 px-3 py-1.5 rounded text-sm"
                onClick={() => setIsOpen(false)}
              >
                No, cancel
              </button>
              <button
                className="flex flex-row gap-x-2 items-center text-white bg-red-500 px-3 py-1.5 rounded text-sm"
                onClick={() => deleteProduct(product?._id)}
              >
                <Trash /> Yes, delete
              </button>
            </div>
          </article>
        </Modal>
      )}
    </>
  );
}

export default Page;
