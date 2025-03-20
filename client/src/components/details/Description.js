import React, { useEffect, useState } from "react";
import DetailCard from "./DetailCard";
import Modal from "../shared/Modal";
import Image from "next/image";
import { useAddReviewMutation } from "@/services/review/reviewApi";
import { toast } from "react-hot-toast";
import Inform from "../icons/Inform";
import { useSelector } from "react-redux";

const Description = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const user = useSelector((state) => state.auth.user);
  const [addReview, { isLoading, data, error }] = useAddReviewMutation();

  useEffect(() => {
    if (isLoading) {
      toast.loading("Adding Review...", { id: "addReview" });
    }

    if (data) {
      toast.success(data?.description, { id: "addReview" });
    }
    if (error?.data) {
      toast.error(error?.data?.description, { id: "addReview" });
    }
  }, [isLoading, data, error]);

  const handleAddReview = (e) => {
    e.preventDefault();

    addReview({
      product: product?._id,
      rating,
      comment: e.target.comment.value,
    });

    e.target.reset();
    setRating(0); // Reset rating
  };

  const StarRating = ({ count = 5 }) => (
    <div className="flex flex-row gap-x-2">
      {Array.from({ length: count }, (_, index) => (
        <button
          type="button"
          key={index}
          onClick={() => setRating(index + 1)}
          className={`text-5xl  transition-transform transform ${
            index + 1 <= rating
              ? "text-yellow-500 hover:text-yellow-400 scale-110"
              : "text-gray-300 hover:text-gray-400"
          }`}
          title={`${index + 1} Star${index + 1 > 1 ? "s" : ""}`}
        >
          ✮
        </button>
      ))}
    </div>
  );
  

  return (
    <section className="flex flex-col gap-y-2.5">
      <div className="flex flex-row gap-x-2 items-center">
        <span className="whitespace-nowrap text-sm text-black select-none">
          Details of this product
        </span>
        <hr className="w-full" />
      </div>
      <article className="flex flex-col gap-y-4">
        <p className="select-none select-none text-sm">{product?.summary}</p>
        <button
          className="px-8 py-2 border border-black rounded-secondary bg-black hover:bg-black/90 text-white transition-colors drop-shadow w-fit flex flex-row gap-x-2 items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          Reviews
        </button>
        <div className="flex flex-row gap-x-2 items-center">
          <span className="whitespace-nowrap text-sm text-black select-none">
            Features & Policies of this product
          </span>
          <hr className="w-full" />
        </div>
        <div className="flex flex-col gap-y-4">
          {product?.features?.map((explanation, index) => (
            <DetailCard
              key={index}
              title={explanation?.title}
              content={explanation?.content}
            />
          ))}
        </div>
      </article>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="p-6 lg:w-1/3 md:w-1/2 w-full h-96"
        >
          <section className="h-full flex flex-col gap-y-6">
            <form
              action=""
              className="flex flex-col gap-y-4"
              onSubmit={handleAddReview}
            >
              <StarRating />
              <textarea
                name="comment"
                id="comment"
                placeholder="Write your thoughts..."
                className="w-full text-sm p-2 border rounded"
              ></textarea>
              <input
                type="submit"
                value="Submit"
                className="text-sm p-2 border bg-black text-white rounded cursor-pointer"
              />
            </form>

            {product?.reviews?.length === 0 ? (
              <p className="select-none select-none text-sm flex flex-row gap-x-1 items-center justify-center">
                <Inform /> No reviews added yet!
              </p>
            ) : (
              <div className="h-full overflow-y-auto scrollbar-hide flex flex-col gap-y-4">
                {product?.reviews?.map((review, index) => (
                  <article
                    key={index}
                    className="flex flex-col gap-y-2 p-4 bg-slate-50 rounded"
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
                        <p className="select-none select-none text-xs">
                          {new Date(review?.createdAt).toLocaleDateString(
                            "en-GB"
                          )}{" "}
                          • ⭐ {review?.rating}
                        </p>
                      </div>
                    </div>
                    <p className="select-none select-none text-sm">
                      {review?.comment}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </Modal>
      )}
    </section>
  );
};

export default Description;
