"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Header1, Header2, Header3, Paragraph1, Paragraph2, ParagraphLink1 } from "@/components/Text";
import Link from "next/link";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard"); // Redirect after successful login
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg_gray px-4 text-[12px] sm:text-[14px] md:text-[16px] lg:text-[17px] xl:text-[18px] 2xl:text-[18px]">
      <form
        onSubmit={handleSignIn}
        className="bg-white p-6 rounded-lg shadow-md max-w-[1200px] "
      >
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className=" col-span-1 hidden xl:block">
            {" "}
            <div className=" flex relative items-center justify-center h-full ">
              {" "}
              <img
                src="/images/logo2.png"
                alt="branding"
                className="w-full "
              />{" "}
              {/* <div className="w-5 h-full bg-white flex  right-0"></div> */}
            </div>
          </div>
          <div className=" col-span-1">
            {" "}
            <Header3 className=" mb-2">Hello Admin!</Header3>
            <Paragraph1 className=" font-bold- mb-6">
              Login to your dashboard to see new orders and form submissions.
            </Paragraph1>
            <div className=" flex flex-col gap-[18px] ">
              <div>
                <label htmlFor="">
                  <Paragraph1 className=" font-bold">E-mail</Paragraph1>
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 mb-2 border outline-none bg-bg_gray rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="">
                  {" "}
                  <Paragraph1 className=" font-bold">Password</Paragraph1>
                </label>{" "}
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 mb-2 border  outline-none bg-bg_gray rounded-lg"
                />
                <div className=" flex justify-end -mt-2">
                  {" "}
                  <Link href="/admin/auth/forgotpassword">
                    <Paragraph2 className=" text-primary">
                      Forgot password?
                    </Paragraph2>
                  </Link>
                </div>
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full bg-primary mt-[40px] rounded-lg text-white p-2"
            >
              <ParagraphLink1> Sign In</ParagraphLink1>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
