"use client";

import React from "react";
import Container from "../Container";
import Image from "next/image";
import Categories from "./Categories";
import Auth from "./Auth";
import Dashboard from "@/components/icons/Dashboard";
import Store from "@/components/icons/Store";
import SearchFilter from "./SearchFilter";
import MyCart from "./MyCart";

import { useSelector } from "react-redux";
import WishList from "./WishList";
import Delivery from "@/components/icons/Delivery";
import Shipping from "@/components/icons/Shipping";

const Header = () => {
  const user = useSelector((state) => state?.auth?.user);

  return (
    <Container>
      <nav className="rounded-xl px-1 py-4  flex flex-row justify-between items-center">
        {/* Logo Section */}
        <div className="flex flex-row gap-1 items-center relative w-full md:w-auto">
          <Categories />
          <Image
            src="/logo.png"
            alt="logo"
            width={141}
            height={40}
            className="h-[50px] object-contain cursor-pointer md:block hidden"
            onClick={() => window.open("/", "_self")}
          />

          {/* For smaller screens, show the logo in a stacked layout */}
          <div className="md:hidden">
            <Image
              src="/logo.png"
              alt="logo"
              width={50}
              height={40}
              className="h-[40px] object-contain cursor-pointer"
              onClick={() => window.open("/", "_self")}
            />
          </div>

          {/* Remove extra gaps or borders and ensure px-1 between logo and Categories */}
        </div>

        {/* Right Section - Search, Auth, Cart, Wishlist */}
        <div className="flex flex-row gap-x-2 relative items-center">
          <SearchFilter />

          {/* Auth Section - Shows only if user is not logged in */}
          {(!user || Object.keys(user).length === 0) && <Auth />}

          {/* If user is logged in, show profile and other options */}
          {user && Object.keys(user).length > 0 && (
            <button
              onClick={() => {
                let path = "/dashboard"; // Default path
                if (user.role === "buyer") {
                  path += "/buyer/my-profile";
                } else if (user.role === "seller") {
                  path += "/seller/my-profile";
                } else if (user.role === "admin") {
                  path += "/admin/list-users";
                }
                window.open(path, "_self");
              }}
            >
              <Auth /> {/* Assuming this is the icon component */}
            </button>
          )}

          {user && Object.keys(user).length > 0 && <MyCart />}
          {user && Object.keys(user).length > 0 && <WishList />}

          {/* Shipping button for logged-in users */}
          {/* {user && Object.keys(user).length > 0 && (
            <button
              className="p-2 rounded-secondary hover:bg-slate-100 transition-colors"
              onClick={() =>
                window.open("/dashboard/buyer/my-purchases", "_self")
              }
            >
              <Shipping className="h-6 w-6" />
            </button>
          )} */}
        </div>
      </nav>
    </Container>
  );
};

export default Header;
