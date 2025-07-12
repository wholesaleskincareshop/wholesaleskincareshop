import { db } from "@/lib/firebase"; // Firestore setup
import { collection, addDoc } from "firebase/firestore"; // Firestore methods
import { Header3, Paragraph2 } from "@/components/Text";
import React, { useState } from "react";
import Button from "@/components/Button";

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
      <div className="container1 flex flex-col items-center">
        <Header3 className="text-center">Newsletter</Header3>
        <Paragraph2 className="text-center">
          Stay informed on new product arrivals, skincare tips, and exclusive
          wholesale offers — straight to your inbox.
        </Paragraph2>

        <div className=" flex border border-primary w-full sm:w-[500px] pl-4 p-1 text-[14px] bg-white rounded-full mt-4 overflow-hidden">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p outline-none  "
            placeholder="Enter your email"
          />

          <Button
            text="Submit"
            onClick={handleSubscribe} // onClick is passed from a client component
            additionalClasses=" bg-primary border-primary w-fit justify-center "
          />
        </div>

        {message && <p className="text-center mt-4 text-red-500-">{message}</p>}
      </div>
    </div>
  );
}

export default NewsLetter;
