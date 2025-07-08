"use client";

import React from "react";
import { useState } from "react";
import { auth } from "@/lib/firebase"; // Firebase auth instance
import { sendPasswordResetEmail } from "firebase/auth";
import { Header3, Header4, Paragraph1, ParagraphLink1 } from "@/components/Text";
import Link from "next/link";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (error) {
      setError("Error sending password reset email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg_gray px-4">
      <div className="bg-white p-6 rounded-[20px] shadow-md w-full max-w-[1000px]">
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className=" col-span-1 hidden xl:block">
              {" "}
              <div className=" flex relative ">
                {" "}
                <img
                  src="https://res.cloudinary.com/dcb4ilgmr/image/upload/v1729544814/utilities/templates/GetBee_1_bxzwaf.png"
                  alt="branding"
                  className="w-full "
                />{" "}
                <div className="w-5 h-full bg-white flex absolute right-0"></div>
              </div>
            </div>
            <div className=" col-span-1">
              {" "}
              <Header4 className=" mb-2">Forgot your password?</Header4>
              <Paragraph1 className=" font-bold- mb-6">
                Login to your dashboard to see new form submissions from your
                potential clients
              </Paragraph1>
              <div className=" flex flex-col gap-[18px] ">
                <div>
                  <label htmlFor="">
                    <Paragraph1 className=" font-bold">
                      Enter your e-mail
                    </Paragraph1>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-2 border outline-none bg-bg_gray rounded-[10px]"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-full font-bold- bg-primary mt-[40px] rounded-[10px] text-white p-2"
              >
                <ParagraphLink1>Send Reset Email</ParagraphLink1>
              </button>
              <Link
                href="/admin/auth/login/"
                className="w-full font-bold- bg-black mt-[10px] flex justify-center rounded-[10px] text-white p-2"
              >
                <ParagraphLink1>Back to Login</ParagraphLink1>
              </Link>
            </div>
          </div>

          {/* ____________________________________________________________________________ */}
          {/* <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Send Reset Email
          </button> */}
        </form>

        {message && <p className="mt-4 text-green-500">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
