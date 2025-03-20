"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa6";

const Whatsapp = () => {
  const router = useRouter();

  const handleClick = async () => {
    const phoneNumber = "6264714906"; // Replace with your phone number
    const whatsappUrlMobile = `whatsapp://send?phone=${phoneNumber}`;
    const whatsappUrlWeb = `https://wa.me/${phoneNumber}`;

    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // Mobile devices
      try {
        window.location.href = whatsappUrlMobile;
      } catch (err) {
        console.error(
          "Failed to open WhatsApp app, falling back to WhatsApp Web"
        );
        window.open(whatsappUrlWeb, "_blank");
      }
    } else {
      // Desktop devices
      try {
        window.open(whatsappUrlWeb, "_blank");
      } catch (err) {
        console.error("Failed to open WhatsApp Web");
      }
    }
  };

  return (
    <>
      <div
        className="fixed bottom-10 right-4 md:right-8 cursor-pointer"
        onClick={handleClick}
      >
        <div className="bg-green-600 p-2 rounded-full w-min flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping"></div>
          <FaWhatsapp color="white" className="w-7 h-7 md:w-10 md:h-10" />
        </div>
      </div>
    </>
  );
};

export default Whatsapp;
