import React from "react";
import { FaBan, FaHandHoldingUsd, FaInstagram } from "react-icons/fa";

const CancellationAndRefund = () => {
  return (
    <div className="max-w-4xl mx-auto p-5 mt-10">
      <title>Cancellation and Refund</title>
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold">Cancellation and Refund Policy</h1>
      </header>
      <main>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaBan className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">No Cancellations</h2>
          <p className="select-none mt-2 clear-both">
            Due to handmade nature of our crochet items, we are unable to
            process cancellation after your order has been placed
          </p>
        </section>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaHandHoldingUsd className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">No Refunds</h2>
          <p className="select-none mt-2 clear-both">
            Once an order is confirmed, it is processed immediately so refund
            cannot be accommodated. Please note that we are not responsible for
            any damage or theft that occurs during transit by third-party
            delivery services and cannot offer refunds in such cases.
          </p>
        </section>
      </main>
      <footer className="text-center text-gray-600 text-sm p-5 mt-10">
        <p>This policy is effective as of 15/11/24.</p>
        <p>
          If you have any questions, feel free to contact us at{" "}
          <a href="mailto:contact.ladyish@gmail.com" className="text-blue-500">
            contact.ladyish@gmail.com
          </a>
        </p>
        <a
          href="https://www.instagram.com/ladyish.in/"
          className="inline-flex items-center px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="mr-2" /> Instagram
        </a>
      </footer>
    </div>
  );
};

export default CancellationAndRefund;
