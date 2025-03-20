import React from "react";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaInstagram,
} from "react-icons/fa";

const Payments = () => {
  return (
    <div className="max-w-4xl mx-auto p-5 mt-10">
      <title>Payments and Refund Policy</title>
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold">Payments and Refund Policy</h1>
      </header>
      <main>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaCreditCard className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">Payment Gateway: Cashfree</h2>
          <p className="select-none mt-2 clear-both">
            We use Cashfree as our trusted payment gateway for processing all
            online payments. Cashfree offers secure, reliable, and fast payment
            processing for a seamless checkout experience. You can pay using a
            variety of methods, including debit cards, UPI, and wallets.
          </p>
        </section>

        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaMoneyBillWave className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">Payment Confirmation</h2>
          <p className="select-none mt-2 clear-both">
            Once your payment is successfully processed through Cashfree, you
            will receive an email confirmation with the payment details and a
            receipt. If there are any issues with your payment, you will be
            notified immediately through the payment gateway.
          </p>
        </section>

        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaExclamationTriangle className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">
            Payment Failures and Refunds
          </h2>
          <p className="select-none mt-2 clear-both">
            In case of any issues where the payment does not reflect in our
            system, but you have successfully made the payment via Cashfree,
            please take a screenshot or note down the payment details (such as
            transaction ID, amount, and date). You can then reach out to us at
            our support email.
          </p>
          <p className="select-none mt-2">
            We will verify the payment and, once confirmed, will process a
            refund for the order if the payment was successful but the order was
            not confirmed. Please allow up to 5 business days for refunds to be
            processed.
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

export default Payments;
