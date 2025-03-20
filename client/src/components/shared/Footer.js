"use client";

import React from "react";
import Container from "./Container";
import { IoAccessibilityOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const router = useRouter();
  const year = new Date().getFullYear();

  const sitemaps = [
    // {
    //   name: "Features",
    //   paths: [
    //     {
    //       name: "Cool stuff",
    //       path: "/",
    //     },
    //     {
    //       name: "Random feature",
    //       path: "/",
    //     },
    //     {
    //       name: "Team feature",
    //       path: "/",
    //     },
    //     {
    //       name: "Stuff for developers",
    //       path: "/",
    //     },
    //     {
    //       name: "Another one",
    //       path: "/",
    //     },
    //     {
    //       name: "Last time",
    //       path: "/",
    //     },
    //   ],
    // },
    // {
    //   name: "Resources",
    //   paths: [
    //     {
    //       name: "Resource",
    //       path: "/",
    //     },
    //     {
    //       name: "Resource name",
    //       path: "/",
    //     },
    //     {
    //       name: "Another resource",
    //       path: "/",
    //     },
    //     {
    //       name: "Final resource",
    //       path: "/",
    //     },
    //   ],
    // },
    {
      name: "About",
      paths: [
        {
          name: "Contact Us",
          path: "/contact-us",
        },
        {
          name: "About Us",
          path: "/about-us",
        },
      ],
    },
    {
      name: "Contact",
      paths: [
        {
          name: "Payments",
          path: "/payments",
        },
        {
          name: "Shipping",
          path: "/shipping",
        },
        {
          name: "Cancellation & Refund",
          path: "/cancellation",
        },
      ],
    },
    {
      name: "Legal",
      paths: [
        // {
        //   name: "About Us",
        //   path: "/about-us",
        // },
        {
          name: "Terms & Conditions",
          path: "/terms",
        },
        {
          name: "Privacy & Policy",
          path: "/privacy",
        },
      ],
    },
    {},
    {
      name: "Stay Connected",
      paths: [
        {
          name: "Instagram",
          path: "https://www.instagram.com/ladyish.in/",
        },
        {
          name: "Pinterest",
          path: "https://pin.it/2vUD79Cwx",
        },
        {
          name: "Twitter",
          path: "https://x.com/Ladyishh_?t=k3f0rLVasl0_NV8JsKhEew&s=08",
        },
      ],
    },
  ];

  return (
    <footer className="footer-1 bg-gray-100 py-8 sm:py-12 m-6 p-6 rounded-xl">
      <div className="container mx-auto px-4 flex flex-col gap-y-10">
        <div className="flex md:flex-row md:flex-wrap md:justify-between flex-col gap-x-4 gap-y-8">
          {sitemaps?.map((sitemap, index) => (
            <div key={index} className="flex flex-col gap-y-3">
              <h2 className="text-2xl">{sitemap.name}</h2>
              <div className="flex flex-col gap-y-1.5">
                {sitemap?.paths?.map((path, index) => (
                  <Link
                    key={index}
                    href={path?.path}
                    className="text-base"
                    target="_blank"
                  >
                    {path?.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <hr />
        <p className="select-none text-center">
          &copy; {year} Ladyish. All rights reserved.
        </p>

        <div className="flex justify-center">
          <img
            src="/Handmade_banner.png" // Replace with your image path
            alt="Footer Image"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
