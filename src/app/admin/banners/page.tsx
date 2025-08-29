import NavBar from "@/components/Admin/navBar/NavBar";
import ProtectedRoute from "@/lib/ProtectedRoute";
import React from "react";
import BannerList from "@/components/Admin/Banners/BannerList";

function page() {
  return (
    <div>
      <ProtectedRoute>
        <NavBar />
        <BannerList />
      </ProtectedRoute>
    </div>
  );
}

export default page;