"use client";

import React, { useState } from "react";
import SearchBar from "./SearchBar";
import Profile from "./Profile";
import { Header1, ParagraphLink1 } from "@/components/Text";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import ExchangeRateComponent from "./ExchangeRateComponent";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/admin/auth/login"); // Redirect to sign-in after logging out
  };

  return (
    <div className="bg-white fixed w-full border-b z-50">
      <div className="container1 py-[12px] w-full text-p_black">
        <div className="flex justify-between items-center">
          <Link  href="/admin/dashboard">
            <img src="/images/logo.png" alt="" className="h-[25px]" />
          </Link>
          <div className="xl:flex gap-[24px] hidden"></div>
          <div className="xl:flex gap-[24px] hidden items-center">
            <Profile />
          </div>

          <div className=" hidden sm:flex">
            <ExchangeRateComponent />
          </div>

          <div className="xl:hidden z-[999] flex">
            <button onClick={toggleMenu} className="focus:outline-none">
              <Image
                height={25}
                width={25}
                src={menuOpen ? "/icons/close.svg" : "/icons/menu.svg"}
                alt="menu"
              />
            </button>
          </div>
        </div>

        {/* <div className="pt-4 xl:hidden "><SearchBar /></div> */}

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-[100%] max-w-[300px]- bg-white py-[24px] pt-[50px] border flex flex-col justify-center- items-center- space-y-[24px] transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="container1 flex flex-col w-full items-center-">
            <div className="py-1 space-y-6">
              <div className="w-full text-left border rounded-[8px] px-2 py-2 flex gap-2 text-gray-700 hover:bg-bg_gray">
                <Profile />
              </div>

              <div className="w-full text-left border rounded-[8px] px-2 py-2 flex gap-2 text-gray-700 hover:bg-bg_gray">
                <ExchangeRateComponent />
              </div>

              <button
                onClick={handleSignOut}
                className="w-full text-left border rounded-[8px] px-2 py-2 flex gap-2 text-gray-700 hover:bg-bg_gray"
              >
                <img src="/icons/logout.svg" alt="" />

                <ParagraphLink1 className=" font-semibold">
                  Logout
                </ParagraphLink1>
              </button>
            </div>
            {/* Add more menu items here */}
          </div>
        </div>

        {/* Overlay to close menu */}
        {/* {menuOpen && (
          <div
            onClick={closeMenu}
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
          ></div>
        )} */}
      </div>
    </div>
  );
}

export default NavBar;
