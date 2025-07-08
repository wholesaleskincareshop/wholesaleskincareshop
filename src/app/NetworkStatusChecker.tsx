"use client"

import { useEffect, useState } from "react";

const NetworkStatusChecker = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isNetworkSlow, setIsNetworkSlow] = useState(false);
  const slowThreshold = 3000; // Set threshold for slow network in milliseconds

  useEffect(() => {
    // Update offline status when the user goes online/offline
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Periodically check network speed
    const checkNetworkSpeed = async () => {
      try {
        const start = Date.now();
        // Ping a reliable server (e.g., Google)
        await fetch("https://jsonplaceholder.typicode.com/posts/1", {
          method: "HEAD",
          cache: "no-store",
        });
        const end = Date.now();
        const duration = end - start;

        // Mark network as slow if the response time exceeds threshold
        setIsNetworkSlow(duration > slowThreshold);
      } catch (error) {
        setIsNetworkSlow(true);
      }
    };

    const intervalId = setInterval(checkNetworkSpeed, 5000); // Check every 5 seconds

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {isOffline && (
        <div className="fixed bottom-0 left-0 right-0 z-[999] justify-end bg-red-500- p-2 text-center text-white">
          <div className=" bg-black rounded-lg p-1 px-4  text-cent text-[12px]  text-white">
            You are offline. Check your internet connection.{" "}
          </div>{" "}
        </div>
      )}
      {isNetworkSlow && !isOffline && (
        <div className="fixed bottom-0 hidden left-0 flex- justify-end right-0 z-[999] bg-yellow-500- p-2 text-center text-black">
          <div className=" bg-yellow-500 rounded-lg p-2 px-4  text-cente  text-black">
            Your network seems slow.
          </div>{" "}
        </div>
      )}
    </>
  );
};

export default NetworkStatusChecker;
