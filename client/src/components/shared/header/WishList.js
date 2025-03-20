import React, { useEffect, useState } from "react";
import OutsideClick from "../OutsideClick";
import Image from "next/image";
import { useSelector } from "react-redux";
import Trash from "@/components/icons/Trash";
import { useRemoveFromFavoriteMutation } from "@/services/favorite/favoriteApi";

import { toast } from "react-hot-toast";
import Inform from "@/components/icons/Inform";
import { useCreatePaymentMutation } from "@/services/payment/paymentApi";

import Heart from "@/components/icons/Heart";

const WishList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
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

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="p-2 rounded-secondary hover:bg-slate-100 transition-colors relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Heart className="h-3 w-3 sm:h-5 sm:w-5" />

        {user?.favorites?.length > 0 && (
          <span className="h-2 w-2 bg-red-500 rounded-secondary absolute top-1 right-1"></span>
        )}
      </button>

      {isOpen && (
        <OutsideClick
          onOutsideClick={() => setIsOpen(false)}
          className="absolute top-full right-0 w-80 h-96 overflow-y-auto bg-white border rounded p-4 flex flex-col gap-y-2.5"
        >
          <div className="w-full h-full flex flex-col gap-y-8">
            {Object.keys(user).length === 0 || user?.favorites?.length === 0 ? (
              <p className="select-none text-sm flex flex-row gap-x-1 items-center justify-center h-full w-full">
                <Inform /> No Products in favorites!
              </p>
            ) : (
              <div className="h-full w-full flex flex-col gap-y-4">
                <div className="h-full overflow-y-auto scrollbar-hide">
                  {user?.favorites?.map(({ product, quantity, _id }) => (
                    <div
                      key={product?._id}
                      className="flex flex-row gap-x-2 transition-all border border-transparent p-2 rounded hover:border-black group relative"
                    >
                      <Image
                        src={product?.thumbnail?.url}
                        alt={product?.thumbnail?.public_id}
                        width={50}
                        height={50}
                        className="rounded h-[50px] w-[50px] object-cover"
                      />
                      <article className="flex flex-col gap-y-2">
                        <div className="flex flex-col gap-y-0.5">
                          <h2 className="text-base line-clamp-1">
                            {product?.title}
                          </h2>
                          <p className="select-none text-xs line-clamp-2">
                            {product?.summary}
                          </p>
                        </div>
                        <div className="flex flex-col gap-y-1">
                          <span className="text-xs flex flex-row gap-x-0.5 items-baseline">
                            ₹
                            <span className="text-sm text-black">
                              {product?.price}.00
                            </span>
                          </span>

                          <div className="flex flex-row gap-x-1">
                            {/* <span className="whitespace-nowrap text-[10px] bg-purple-300/50 text-purple-500 border border-purple-500 px-1.5 rounded">
                              {product?.store?.title}
                            </span> */}
                            <span className="whitespace-nowrap text-[10px] bg-indigo-300/50 text-indigo-500 border border-indigo-500 px-1.5 rounded">
                              {product?.category?.title}
                            </span>
                            {/* <span className="whitespace-nowrap text-[10px] bg-blue-300/50 text-[#d18971] border border-blue-500 px-1.5 rounded">
                              {product?.category.quantity}
                            </span> */}
                          </div>
                        </div>
                      </article>

                      <button
                        type="button"
                        className="opacity-0 transition-opacity group-hover:opacity-100 absolute top-2 right-2 border p-1 rounded-secondary bg-red-100 text-red-900 border-red-900"
                        onClick={() => removeFromFavorite({ id: _id })}
                      >
                        <Trash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </OutsideClick>
      )}
    </>
  );
};

// Function to send message using WhatsApp API

export default WishList;
