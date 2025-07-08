import { db } from "@/lib/firebase"; // Firestore setup
import { collection, addDoc } from "firebase/firestore"; // Firestore methods
import { Header3, Paragraph2 } from "@/components/Text";
import React, { useState } from "react";

function NewsLetter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      // Save email to Firestore
      const docRef = await addDoc(collection(db, "emails"), { email });
      setMessage("Thank you for subscribing!");
      setEmail(""); // Clear input after successful submission
    } catch (error) {
      console.error("Error saving email:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-bg_gray py-[50px]">
      <div className="container1">
        <Header3 className="text-center">Newsletter</Header3>
        <Paragraph2 className="text-center">
          Stay up to date with the latest beauty trends and exclusive offers
          from GrandioseGrin.
        </Paragraph2>

        <div className="pl-4 flex border border-primary text-[14px] bg-white rounded-full mt-4 overflow-hidden">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p outline-none"
            placeholder="Enter your email"
          />
          <button
            className="p-2 px-4 bg-primary text-white hover:bg-black"
            onClick={handleSubscribe}
          >
            Subscribe
          </button>
        </div>

        {message && <p className="text-center mt-4 text-red-500-">{message}</p>}
      </div>
    </div>
  );
}

export default NewsLetter;
