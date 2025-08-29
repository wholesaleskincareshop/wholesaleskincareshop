"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import BannerModal from "./BannerModal";
import { Header4, HeaderAny, Paragraph1 } from "@/components/Text";

const BannerList = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editBanner, setEditBanner] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      const snapshot = await getDocs(collection(db, "banners"));
      setBanners(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchBanners();
  }, []);

  const handleDelete = async (banner: any) => {
    if (!confirm("Delete this banner?")) return;

    // delete from Cloudinary
    await fetch("/api/delete-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_id: banner.bannerImagePublicId }),
    });

    // delete from Firestore
    await deleteDoc(doc(db, "banners", banner.id));
    setBanners(banners.filter((b) => b.id !== banner.id));
  };

  return (
    <div className="p-6 pt-[100px]">
      <div className="flex justify-between mb-4">
        <Header4 className="text-2xl font-bold">Manage Banners</Header4>
        <button
          className="px-4 py-2 bg-primary text-white rounded"
          onClick={() => {
            setEditBanner(null);
            setOpenModal(true);
          }}
        >
          + Add Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="border rounded-lg  flex flex-col items-center"
          >
            <div
              className=" cursor-pointer flex w-full "
              onClick={() => {
                setEditBanner(banner);
                setOpenModal(true);
              }}
            >
              <img
                src={banner.bannerImageURL}
                alt={banner.name}
                className="w-full h-[250px] object-cover rounded"
              />
            </div>{" "}
            <div className="flex w-full gap-2 mt-2 items-end p-2 justify-between">
              <HeaderAny className=" text-[18px] font-bold capitalize">
                {banner.name}
              </HeaderAny>

              <button
                className=" text-red-500  rounded"
                onClick={() => handleDelete(banner)}
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
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {openModal && (
        <BannerModal banner={editBanner} onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
};

export default BannerList;
