import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // Firestore setup
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { ParagraphLink1 } from "@/components/Text";

const ExchangeRateComponent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newRate, setNewRate] = useState<string>("");
  const [currentRate, setCurrentRate] = useState<string>("");

  useEffect(() => {
    const exchangeRateDoc = doc(db, "ExchangeRate", "rateId"); 
    const unsubscribe = onSnapshot(exchangeRateDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setCurrentRate(docSnapshot.data().rate);
      } else {
        console.error("Document does not exist!");
      }
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setNewRate(currentRate); // Pre-fill with current value
  };

  const handleSave = async () => {
    try {
      const exchangeRateDoc = doc(db, "ExchangeRate", "rateId"); // Replace "rateId" with your document ID
      await setDoc(exchangeRateDoc, { rate: newRate });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating exchange rate: ", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewRate("");
  };

  return (
    <div className="flex gap-2 items-center px-2 sm:border rounded-lg">
      <ParagraphLink1>1 USD </ParagraphLink1>
      <div> - </div>
      {!isEditing ? (
        <div className="flex items-center gap-2">
          <div onClick={handleEditClick}>
            <ParagraphLink1>{currentRate} NGN</ParagraphLink1>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="border p-1 rounded w-[100px]"
            value={newRate}
            onChange={(e) => setNewRate(e.target.value)}
          />
          <button className="text- hover:underline" onClick={handleSave}>
            save
          </button>
          <button
            className=" hover:underline"
            onClick={handleCancel}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExchangeRateComponent;
