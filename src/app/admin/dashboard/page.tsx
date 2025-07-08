import NavBar from "@/components/Admin/navBar/NavBar";
import Overview from "@/components/Admin/Overview";
import ProtectedRoute from "@/lib/ProtectedRoute";
import React from "react";

function page() {
  return (
    <div>
      <ProtectedRoute>
        <NavBar />
        <Overview />
      </ProtectedRoute>
    </div>
  );
}

export default page;
