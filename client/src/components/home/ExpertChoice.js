

"use client";

import React, { useEffect, useMemo } from "react";
import Container from "../shared/Container";
import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useGetProductsQuery } from "@/services/product/productApi";
import ExpertCard from "../shared/skeletonLoading/ExpertCard";
import { toast } from "react-hot-toast";

const ExpertChoice = ({ className }) => {

  const router = useRouter();

  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
  } = useGetProductsQuery();
  const products = useMemo(() => productsData?.data || [], [productsData]);

  useEffect(() => {
    if (productsError) {
      toast.error(productsError?.data?.description, { id: "expert-choice" });
    }
  }, [productsError]);

  return (
    <Container className={className ? className : ""}>
      <section className="flex flex-col gap-y-10">
        <h1 className="text-4xl">
          People&apos;s Choice. <span className="">Most Favorites</span>
        </h1>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-8">
          {productsLoading ? (
            <>
              {[1, 2, 3, 4].map((_, index) => (
                <ExpertCard key={index} />
              ))}
            </>
          ) : (
            <>
              {products?.slice(-8)?.map((product, index) => {
                const reviews = product?.reviews || [];
                const totalRating = reviews.reduce(
                  (sum, review) => sum + review.rating,
                  0
                );
                const averageRating =
                  reviews.length > 0
                    ? (totalRating / reviews.length).toFixed(1)
                    : 0;
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-y-4 border p-4 rounded-lg hover:border-black transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/product?product_id=${
                          product?._id
                        }&product_title=${product.title
                          .replace(/ /g, "-")
                          .toLowerCase()}}`
                      )
                    }
                  >
                    <div className="grid grid-cols-12 grid-rows-6 gap-2 h-[200px]">
                      {product.gallery.map((thumbnail, idx) => (
                        <Image
                          key={idx}
                          src={thumbnail?.url}
                          alt={thumbnail?.public_id}
                          width={296}
                          height={200}
                          className={`${
                            product.gallery.length === 1
                              ? "col-span-12 row-span-6"
                              : product.gallery.length === 2
                              ? "col-span-12 row-span-3"
                              : product.gallery.length === 3
                              ? idx === 0
                                ? "col-span-12 row-span-3"
                                : "col-span-6 row-span-3"
                              : product.gallery.length === 4
                              ? "col-span-6 row-span-3"
                              : idx <= 1
                              ? "col-span-6 row-span-3"
                              : "col-span-4 row-span-3"
                          } h-full w-full object-cover rounded`}
                        />
                      ))}
                    </div>

                    <article className="flex flex-col gap-y-3.5">
                      <div className="flex flex-row items-center gap-x-1.5">
                        <div className="flex items-center space-x-2">
                          {product?.variations?.colors?.length > 0 ||
                          product?.variations?.sizes?.length > 0 ? (
                            <>
                              <Badge className="text-indigo-800 bg-indigo-100">
                                {product?.variations?.colors?.length > 0
                                  ? `${product?.variations?.colors?.length} Colors`
                                  : "No Colors Available"}
                              </Badge>
                              <div className="h-5 border-l w-[1px]"></div>
                              <Badge className="text-purple-800 bg-purple-100">
                                {product?.variations?.sizes?.length > 0
                                  ? `${product?.variations?.sizes?.length} Sizes`
                                  : "No Sizes Available"}
                              </Badge>
                            </>
                          ) : (
                            <Badge className="text-purple-800 bg-purple-100">
                              No Colors Available
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-y-4">
                        <h2 className="line-clamp-1">{product?.title}</h2>
                        <div className="flex flex-row items-end justify-between">
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
                  </div>
                );
              })}
            </>
          )}
        </div>
        {!productsLoading && products?.length === 0 && (
          <p className="select-none text-sm">Oops! No products found!</p>
        )}
      </section>
    </Container>
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

export default ExpertChoice;
