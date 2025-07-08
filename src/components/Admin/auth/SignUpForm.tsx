"use client";

import React from "react";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

      const handleSignUp = async (e: any) => {
      e.preventDefault();
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("User registered successfully");
      } catch (error: any) {
        setError(error.message);
      }
    };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSignUp} className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl mb-4">Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-2 border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-2 border"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;
