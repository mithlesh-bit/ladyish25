import React from "react";
import { FaInstagram } from "react-icons/fa6";

const Instagram = () => {
  const handleClick = () => {
    const instagramUsername = "ladyish.in"; // Replace with your Instagram username
    const appUrl = `instagram://user?username=${instagramUsername}`;
    const webUrl = `https://www.instagram.com/${instagramUsername}/`;

    // Try opening the Instagram app first
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
      window.location.href = appUrl;

      // If the app isn't installed or fails to open, fall back to the web URL
      setTimeout(() => {
        window.open(webUrl, "_blank");
      }, 1000); // Delay to ensure app attempt finishes
    } else {
      // On non-mobile devices, fallback to web URL
      window.open(webUrl, "_blank");
    }
  };

  return (
    <div
      className="fixed bottom-10 right-4 md:right-8 cursor-pointer"
      onClick={handleClick}
    >
      <div className="bg-pink-600 p-2 rounded-full w-min flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-full border-4 border-pink-500 animate-ping"></div>
        <FaInstagram color="white" className="w-7 h-7 md:w-10 md:h-10" />
      </div>
    </div>
  );
};

export default Instagram;
