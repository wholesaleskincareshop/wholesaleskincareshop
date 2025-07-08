import { db } from "@/lib/firebase"; // Firestore setup
import { collection, getDocs, DocumentData } from "firebase/firestore"; // Firestore methods
import React, { useEffect, useState } from "react";

interface Email {
  email: string;
}

function EmailList(): JSX.Element {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch emails from Firestore
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "emails"));
        const emailData: Email[] = querySnapshot.docs.map(
          (doc: DocumentData) => ({
            email: doc.data().email,
          })
        );
        setEmails(emailData);
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  // Convert emails to CSV format and trigger download
  const exportToCSV = () => {
    if (emails.length === 0) return;

    const csvHeaders = "Email\n";
    const csvRows = emails.map((item) => item.email).join("\n");
    const csvContent = `data:text/csv;charset=utf-8,${csvHeaders}${csvRows}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "emails.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4 bg-white text-[14px] ">
      {loading ? (
        <p>Loading emails...</p>
      ) : (
        <>
          {emails.length === 0 ? (
            <p>No emails found.</p>
          ) : (
            <div>
              <div className="w-full ">
                <div className=" mb-4 flex justify-between items-center">
                  <div className=""># {emails.length} </div>
                  <button
                    onClick={exportToCSV}
                    className=" px-2 py-1  flex w-fit border gap-2 items-center hover:bg-bg_gray rounded-lg "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </button>
                </div>

                <div className=" h-[300px] overflow-hidden overflow-y-auto scrollbar-hide">
                  {emails.map((item, index) => (
                    <div
                      key={index}
                      className=" flex items-center gap-2 border-t py-2 "
                    >
                      <div className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                          />
                        </svg>
                      </div>
                      <div className="">{item.email}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EmailList;
