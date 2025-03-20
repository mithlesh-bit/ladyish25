import React from "react";
import {
  FaFileContract,
  FaShippingFast,
  FaRedoAlt,
  FaMoneyCheckAlt,
  FaInstagram,
  FaEdit,
} from "react-icons/fa";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-5 mt-10">
      <title>Terms and Conditions</title>
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold">Terms and Conditions</h1>
      </header>
      <main>
        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaFileContract className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="select-none mt-2 clear-both">
            Last updated on 10-11-2024 11:54:43
            <br />
            These Terms and Conditions, along with the privacy policy or other
            terms (“Terms”) constitute a binding agreement by and between EESHA,
            ( “Website Owner” or “we” or “us” or “our”) and you (“you” or
            “your”) and relate to your use of our website, goods (as applicable)
            or services (as applicable) (collectively, “Services”).
            <br />
            By using our website and availing the Services, you agree that you
            have read and accepted these Terms (including the Privacy Policy).
            We reserve the right to modify these Terms at any time and without
            assigning any reason. It is your responsibility to periodically
            review these Terms to stay informed of updates.
          </p>
        </section>

        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaShippingFast className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">2. Use of Services</h2>
          <div className="select-none mt-2 clear-both">
            <p>
              The use of this website or availing of our Services is subject to
              the following terms of use:
            </p>
            <ul className="list-disc ml-5 mt-2">
              <li>
                To access and use the Services, you agree to provide true,
                accurate and complete information to us during and after
                registration, and you shall be responsible for all acts done
                through the use of your registered account.
              </li>
              <li>
                Neither we nor any third parties provide any warranty or
                guarantee as to the accuracy, timeliness, performance,
                completeness or suitability of the information and materials
                offered on this website or through the Services, for any
                specific purpose.
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaRedoAlt className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">3. Website Content</h2>
          <p className="select-none mt-2 clear-both">
            The contents of the Website and the Services are proprietary to Us
            and you will not have any authority to claim any intellectual
            property rights, title, or interest in its contents.
          </p>
        </section>

        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaMoneyCheckAlt className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">4. Payments and Refunds</h2>
          <p className="select-none mt-2 clear-both">
            You agree to pay us the charges associated with availing the
            Services.
            <br />
            We do not offer refunds or exchanges once a product has been
            purchased. However, if the product is damaged upon arrival, you may
            contact us via Instagram or email to register a complaint. To
            qualify for a refund, you must record a video while opening the
            package to demonstrate that the product was defective upon receipt.
            Once we verify your claim, we will initiate the refund process.
          </p>
        </section>

        <section className="bg-[#f9fafb] p-6 rounded-sm shadow-md mb-6">
          <FaEdit className="text-[#d18971] text-3xl float-left mr-4" />
          <h2 className="text-2xl font-semibold">5. Legal Disclaimers</h2>
          <p className="select-none mt-2 clear-both">
            These Terms and any dispute or claim relating to it, or its
            enforceability, shall be governed by and construed in accordance
            with the laws of India. All disputes arising out of or in connection
            with these Terms shall be subject to the exclusive jurisdiction of
            the courts in Raipur, Chattisgarh.
          </p>
        </section>
      </main>
      <footer className="text-center text-gray-600 text-sm p-5 mt-10">
        <p>These terms are effective as of 10/11/2024</p>
        <p>
          If you have any questions, feel free to contact us at{" "}
          <a href="mailto:laadyish@gmail.com" className="text-blue-500">
            laadyish@gmail.com
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

export default TermsAndConditions;
